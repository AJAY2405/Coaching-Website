import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { TEST_API_END_POINT } from "../../utils/constants";

function CreateTest() {
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // ✅ NEW: duration in minutes, defaults to 30
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "",
      image: null, // ⬅️ optional image
    },
  ]);

  // PDF-based question generation
  const [pdfFile, setPdfFile] = useState(null);
  const [parsingPdf, setParsingPdf] = useState(false);

  const handleParsePdf = async () => {
    if (!pdfFile) {
      toast.error("Choose a PDF file first");
      return;
    }

    try {
      setParsingPdf(true);
      const pdfFormData = new FormData();
      pdfFormData.append("pdf", pdfFile);

      const res = await axios.post(
        `${TEST_API_END_POINT}/parse-pdf`,
        pdfFormData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const extracted = res.data.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        image: null,
      }));

      // If the form still has only the default empty question, replace it;
      // otherwise append the extracted ones to whatever's already there.
      setQuestions((prev) => {
        const isDefaultEmpty =
          prev.length === 1 &&
          !prev[0].question &&
          !prev[0].options.A &&
          !prev[0].options.B &&
          !prev[0].options.C &&
          !prev[0].options.D;
        return isDefaultEmpty ? extracted : [...prev, ...extracted];
      });

      toast.success(`Extracted ${extracted.length} question(s) — review before saving`);
      setPdfFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to parse PDF");
    } finally {
      setParsingPdf(false);
    }
  };

  // Handle text fields
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Handle options (A, B, C, D)
  const handleOptionChange = (qIndex, optionKey, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionKey] = value;
    setQuestions(newQuestions);
  };

  // Handle image upload
  const handleImageChange = (qIndex, file) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].image = file;
    setQuestions(newQuestions);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
        image: null,
      },
    ]);
  };

  // Submit test
  const submitTest = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("You must be logged in as a teacher to create a test");
      return;
    }

    // ✅ NEW: basic validation on duration before submitting
    const durationNum = Number(duration);
    if (!Number.isFinite(durationNum) || durationNum <= 0) {
      toast.error("Please enter a valid duration (in minutes)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("teacher", user._id); // ✅ FIX: teacher id was never sent before
      formData.append("duration", durationNum); // ✅ NEW: send duration to backend
      formData.append(
        "questions",
        JSON.stringify(
          questions.map(({ question, options, correctAnswer }) => ({
            question,
            options,
            correctAnswer,
            // ⬅️ don't include image here (we send separately below)
          }))
        )
      );

      // Append images separately (if any)
      questions.forEach((q) => {
        if (q.image) {
          formData.append("images", q.image);
        }
      });

      await axios.post(TEST_API_END_POINT, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Test created successfully!");
      setTitle("");
      setDescription("");
      setDuration(30); // ✅ NEW: reset to default after save
      setQuestions([
        { question: "", options: { A: "", B: "", C: "", D: "" }, correctAnswer: "", image: null },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Error creating test");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto mt-15 bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Nav buttons: view all tests / create new test */}
      <div className="flex gap-2 mb-4">
        <Link
          to="/teacher/tests"
          className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-500 dark:hover:bg-blue-600"
        >
          View All Tests
        </Link>
        <Link
          to="/teacher/create-test"
          className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500 dark:hover:bg-green-600"
        >
          Create New Test
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Create Test</h2>

      {/* Generate questions from a PDF */}
      <div className="border-2 border-dashed border-blue-300 dark:border-blue-800 rounded p-4 mb-6 bg-blue-50 dark:bg-blue-950/40">
        <h3 className="font-semibold mb-2">📄 Generate Questions from PDF</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          PDF must follow this format: <code>1. Question</code> / <code>A) option</code> /{" "}
          <code>B) option</code> / ... / <code>Answer: B</code>
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <button
            type="button"
            onClick={handleParsePdf}
            disabled={parsingPdf}
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-60"
          >
            {parsingPdf ? "Extracting..." : "Extract Questions"}
          </button>
        </div>
      </div>

      <form onSubmit={submitTest}>
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full mb-2 rounded"
          placeholder="Test Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full mb-4 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* ✅ NEW: Duration field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ⏱ Test Duration (in minutes)
          </label>
          <input
            type="number"
            min="1"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full sm:w-48 rounded"
            placeholder="e.g. 30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Students will have this much time to complete the test once they start.
          </p>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border border-gray-300 dark:border-gray-700 p-4 mb-4 rounded">
            <input
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full mb-2 rounded"
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
            />

            {["A", "B", "C", "D"].map((opt) => (
              <input
                key={opt}
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full mb-2 rounded"
                placeholder={`Option ${opt}`}
                value={q.options[opt]}
                onChange={(e) => handleOptionChange(qIndex, opt, e.target.value)}
              />
            ))}

            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 w-full mb-2 rounded"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
            >
              <option value="">Select Correct Answer</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            {/* Optional image upload */}
            <input
              type="file"
              accept="image/*"
              className="mb-2 text-black dark:text-white"
              onChange={(e) => handleImageChange(qIndex, e.target.files[0])}
            />

            {q.image && (
              <p className="text-sm text-green-600 dark:text-green-400">Image selected: {q.image.name}</p>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-yellow-600 dark:bg-yellow-700 text-white p-2 rounded mr-2 hover:bg-amber-500 dark:hover:bg-amber-600"
          onClick={addQuestion}
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-green-600 dark:bg-green-700 text-white p-2 rounded hover:bg-green-500 dark:hover:bg-green-600"
        >
          Save Test
        </button>
      </form>
    </div>
  );
}

export default CreateTest;