import Test from "../models/test_model.js";
import Result from "../models/Result.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { PDFParse } from "pdf-parse";

// Create test with optional question images
export const createTest = async (req, res) => {
  try {
    let { title, description, teacher, questions, duration } = req.body;

    // parse JSON string if frontend sends it as form-data
    if (typeof questions === "string") {
      questions = JSON.parse(questions);
    }

  
    const parsedDuration = Number(duration);
    const finalDuration =
      Number.isFinite(parsedDuration) && parsedDuration > 0
        ? parsedDuration
        : undefined;

   
    if (req.files && req.files["images"]) {
      const uploadedImages = await Promise.all(
        req.files["images"].map(async (file) => {
          const fileUri = getDataUri(file);
          const upload = await cloudinary.uploader.upload(fileUri.content, {
            folder: "tests/questions",
          });
          return upload.secure_url;
        }),
      );

      questions = questions.map((q, index) => ({
        ...q,
        image: uploadedImages[index] || null,
      }));
    }

    const test = new Test({
      title,
      description,
      teacher,
      questions,
      duration: finalDuration, 
    });

    await test.save();
    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().lean();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tests by teacher
export const getTestsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const tests = await Test.find({ teacher: teacherId }).lean();
    res.json({ tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single test by id (used to pre-fill the edit form)
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).lean();
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a test (title, description, questions, optionally new images)
export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, questions, duration } = req.body;

    if (typeof questions === "string") {
      questions = JSON.parse(questions);
    }

    // NEW: only touch duration if it was actually sent in the update
    const updatePayload = { title, description, questions };
    if (duration !== undefined && duration !== "") {
      const parsedDuration = Number(duration);
      if (Number.isFinite(parsedDuration) && parsedDuration > 0) {
        updatePayload.duration = parsedDuration;
      }
    }

    // handle any newly uploaded images (optional, matched by index like createTest)
    if (req.files && req.files["images"]) {
      const uploadedImages = await Promise.all(
        req.files["images"].map(async (file) => {
          const fileUri = getDataUri(file);
          const upload = await cloudinary.uploader.upload(fileUri.content, {
            folder: "tests/questions",
          });
          return upload.secure_url;
        }),
      );

      let imgIndex = 0;
      questions = questions.map((q) => {
        // if question didn't already have an image and a new one was uploaded, attach it
        if (!q.image && uploadedImages[imgIndex]) {
          const img = uploadedImages[imgIndex];
          imgIndex += 1;
          return { ...q, image: img };
        }
        return q;
      });
      updatePayload.questions = questions;
    }

    const updatedTest = await Test.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res
      .status(200)
      .json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a test
export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Test.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single test for a student to take (correct answers stripped out)
export const getTestForStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id).lean();

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Strip correctAnswer so it's never sent to the client taking the test
    const safeTest = {
      _id: test._id,
      title: test.title,
      description: test.description,
      duration: test.duration, 
      questions: test.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        image: q.image || null,
      })),
    };

    res.status(200).json(safeTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit a student's answers, score them, and save a Result
export const submitTestAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, studentName, studentEmail } = req.body;
    const normalizedEmail = (studentEmail || "").trim().toLowerCase();

    const test = await Test.findById(id).lean();
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const totalQuestions = test.questions.length;
    let score = 0;

    test.questions.forEach((q, idx) => {
      if (answers[idx] && answers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const result = await Result.create({
      test: test._id,
      studentName,
      studentEmail: normalizedEmail,
      score,
      percentage,
      submittedAt: new Date(),
      answers: answers || [], // FIX: save the student's actual picks per question index, needed for review page
    });

    res.status(201).json({
      totalQuestions,
      score,
      percentage,
      resultId: result._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get test submissions
export const getTestSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await Result.find({ test: id }).lean();
    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// NEW: Get a full review of a student's attempt — questions, options,
// correct answers, and what the student actually picked, keyed by index.
export const getTestReview = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId).populate("test").lean();
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const test = result.test;
    if (!test) {
      return res.status(404).json({ message: "Associated test not found" });
    }

    const review = {
      testTitle: test.title,
      score: result.score,
      percentage: result.percentage,
      totalQuestions: test.questions.length,
      questions: test.questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        image: q.image || null,
        correctAnswer: q.correctAnswer,
        studentAnswer: result.answers?.[idx] ?? null, // null = unanswered
      })),
    };

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Extract questions from an uploaded PDF (expects a consistent numbered format)
export const parseTestPdf = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // pdf-parse v2 exposes a class — must be instantiated with `new`,
    // then text is read via .getText(), not by calling PDFParse() directly.
    const parser = new PDFParse({ data: file.buffer });
    const textResult = await parser.getText();
    await parser.destroy();

    const questions = extractQuestionsFromText(textResult.text);

    if (questions.length === 0) {
      return res.status(422).json({
        message:
          "Could not detect any questions in this PDF. Make sure it follows the format: '1. Question' / 'A) option' / 'Answer: X'.",
      });
    }

    res.status(200).json({ questions });
  } catch (error) {
    console.error("PDF parse error:", error);
    res.status(500).json({ message: "Failed to parse PDF" });
  }
};

// Parses raw PDF text into { question, options: {A,B,C,D}, correctAnswer } objects.
// Expects a format like:
//   1. What is 2 + 2?
//   A) 3
//   B) 4
//   C) 5
//   D) 6
//   Answer: B
function extractQuestionsFromText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questionStartRegex = /^\d+[.)]\s*(.+)/;
  const optionRegex = /^([A-Da-d])[.)]\s*(.+)/;
  const answerRegex = /^(Answer|Ans)\s*[:\-]?\s*([A-Da-d])/i;

  const questions = [];
  let current = null;

  for (const line of lines) {
    const qMatch = line.match(questionStartRegex);
    const optMatch = line.match(optionRegex);
    const ansMatch = line.match(answerRegex);

    if (qMatch && !optMatch) {
      // starting a new question — push the previous one if it looks complete
      if (current && current.question) {
        questions.push(current);
      }
      current = {
        question: qMatch[1].trim(),
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
      };
    } else if (optMatch && current) {
      const letter = optMatch[1].toUpperCase();
      current.options[letter] = optMatch[2].trim();
    } else if (ansMatch && current) {
      current.correctAnswer = ansMatch[2].toUpperCase();
    } else if (current && !optMatch && !ansMatch) {
      // wrapped continuation line of the question text
      current.question += " " + line;
    }
  }

  if (current && current.question) {
    questions.push(current);
  }

  // only keep questions that got at least 2 options extracted
  return questions.filter(
    (q) => Object.values(q.options).filter((v) => v.trim() !== "").length >= 2
  );
}