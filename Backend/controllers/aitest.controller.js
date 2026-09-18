import groq from "../utils/groqClient.js";
import AiTest from "../models/aitest.model.js";
import AiTestResult from "../models/aitestResult.model.js";



// export const generateAiTest = async (req, res) => {
//   try {
//     const { subject, topic, difficulty = "medium", numQuestions = 10, duration = 30 } = req.body;

//     const prompt = `Generate ${numQuestions} multiple-choice questions on "${topic}" (subject: ${subject}), difficulty: ${difficulty}.
// Return ONLY valid JSON array, no markdown, in this exact format:
// [{"questionText":"","options":["","","",""],"correctAnswer":"","explanation":""}]`;

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.5,
//     });

//     let raw = completion.choices[0].message.content.trim();
//     raw = raw.replace(/```json|```/g, "");
//     const questions = JSON.parse(raw);

//     const aiTest = await AiTest.create({
//       title: `${topic} - AI Generated Test`,
//       subject,
//       topic,
//       difficulty,
//       duration,
//       totalMarks: questions.length,
//       questions,
//       createdBy: req.id, // set by isAuthenticated middleware
//     });

//     res.status(201).json({ success: true, aiTest });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const generateAiTest = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    // console.log("REQ ID (from auth middleware):", req.id);

    const { subject, topic, difficulty = "medium", numQuestions = 10, duration = 30 } = req.body;

    const prompt = `Generate ${numQuestions} multiple-choice questions on "${topic}" (subject: ${subject}), difficulty: ${difficulty}.
Return ONLY valid JSON array, no markdown, in this exact format:
[{"questionText":"","options":["","","",""],"correctAnswer":"","explanation":""}]`;

    const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-120b", // ✅ current, free tier
  messages: [{ role: "user", content: prompt }],
  temperature: 0.5,
});

    let raw = completion.choices[0].message.content.trim();
    raw = raw.replace(/```json|```/g, "");
    const questions = JSON.parse(raw);

    const aiTest = await AiTest.create({
      title: `${topic} - AI Generated Test`,
      subject,
      topic,
      difficulty,
      duration,
      totalMarks: questions.length,
      questions,
      createdBy: req.id,
    });

    res.status(201).json({ success: true, aiTest });
  } catch (err) {
    console.error(" AI TEST GENERATION ERROR:", err); // full error object
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getAiTests = async (req, res) => {
  try {
    const tests = await AiTest.find({ createdBy: req.id })
      .select("title subject topic difficulty duration totalMarks createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAiTestById = async (req, res) => {
  const test = await AiTest.findById(req.params.id);
  if (!test) return res.status(404).json({ success: false, message: "Not found" });
  res.status(200).json({ success: true, test });
};

export const deleteAiTest = async (req, res) => {
  await AiTest.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Deleted" });
};




export const submitAiTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const test = await AiTest.findById(id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    let score = 0;
    const reviewed = test.questions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Number(((score / test.questions.length) * 100).toFixed(2));

    //  persist the result
    await AiTestResult.create({
      test: test._id,
      student: req.id,
      answers,
      score,
      total: test.questions.length,
      percentage,
    });

    res.status(200).json({
      success: true,
      score,
      total: test.questions.length,
      percentage,
      reviewed,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// export const getAiTests = async (req, res) => {
//   try {
//     const tests = await AiTest.find({ createdBy: req.id })
//       .select("title subject topic difficulty duration totalMarks createdAt")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, tests });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// List ALL AI tests available to students (not filtered by teacher)
export const getAllAiTestsForStudents = async (req, res) => {
  try {
    const tests = await AiTest.find()
      .select("title subject topic difficulty duration totalMarks createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single test for ATTEMPTING — strips correctAnswer & explanation
export const getAiTestForAttempt = async (req, res) => {
  try {
    const test = await AiTest.findById(req.params.id).select(
      "-questions.correctAnswer -questions.explanation"
    );
    if (!test) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// Student: their own AI test history
export const getMyAiTestResults = async (req, res) => {
  try {
    const results = await AiTestResult.find({ student: req.id })
      .populate("test", "title subject topic difficulty")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Teacher: results of all students across tests THEY created
export const getAiTestResultsForTeacher = async (req, res) => {
  try {
    const myTests = await AiTest.find({ createdBy: req.id }).select("_id");
    const testIds = myTests.map((t) => t._id);

    const results = await AiTestResult.find({ test: { $in: testIds } })
      .populate("student", "fullname email")
      .populate("test", "title subject topic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




export const getAiTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await AiTestResult.findById(resultId).populate("test");
    if (!result) return res.status(404).json({ success: false, message: "Result not found" });

    // Only the student who owns this result (or the teacher who owns the test) can view it
    const isOwner = result.student.toString() === req.id;
    const isTestOwner = result.test?.createdBy?.toString() === req.id;
    if (!isOwner && !isTestOwner) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const reviewed = result.test.questions.map((q, i) => {
      const userAnswer = result.answers[i];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    res.status(200).json({
      success: true,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      testTitle: result.test.title,
      reviewed,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// Summary: one card per test, with attempt count + average score
export const getAiTestResultsSummaryForTeacher = async (req, res) => {
  try {
    const myTests = await AiTest.find({ createdBy: req.id }).select(
      "title subject topic difficulty totalMarks duration"
    );

    const summaries = await Promise.all(
      myTests.map(async (test) => {
        const results = await AiTestResult.find({ test: test._id });
        const attempts = results.length;
        const avgPercentage =
          attempts > 0
            ? (results.reduce((sum, r) => sum + r.percentage, 0) / attempts).toFixed(1)
            : 0;

        return {
          _id: test._id,
          title: test.title,
          subject: test.subject,
          topic: test.topic,
          difficulty: test.difficulty,
          totalMarks: test.totalMarks,
          attempts,
          avgPercentage,
        };
      })
    );

    res.status(200).json({ success: true, summaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Detail: all student results for ONE specific test
export const getAiTestResultsByTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await AiTest.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    if (test.createdBy.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const results = await AiTestResult.find({ test: testId })
      .populate("student", "fullname email")
      .sort({ percentage: -1 });

    res.status(200).json({ success: true, test, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateAiTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, topic, difficulty, duration, questions } = req.body;

    const test = await AiTest.findById(id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    if (test.createdBy.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (title !== undefined) test.title = title;
    if (subject !== undefined) test.subject = subject;
    if (topic !== undefined) test.topic = topic;
    if (difficulty !== undefined) test.difficulty = difficulty;
    if (duration !== undefined) test.duration = duration;
    if (questions !== undefined) {
      test.questions = questions;
      test.totalMarks = questions.length;
    }

    await test.save();
    res.status(200).json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};