import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { STUDENT_API_END_POINT } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function TestReview() {
  const { resultId } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (!resultId) return;
    let cancelled = false;

    axios
      .get(`${STUDENT_API_END_POINT}/review/${resultId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!cancelled) setReview(res.data);
      })
      .catch((e) => {
        if (!cancelled) setErr(e?.response?.data?.message || e.message);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [resultId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 animate-pulse bg-white dark:bg-black">
        Loading review…
      </div>
    );

  if (err)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 bg-white dark:bg-black">
        Error: {err}
      </div>
    );

  if (!review)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black">
        Review not found.
      </div>
    );

  const totalQuestions = review.questions.length;
  const q = review.questions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const isFirstQuestion = currentQuestion === 0;

  const isAnswered = q.studentAnswer !== null && q.studentAnswer !== undefined;
  const isCorrect = isAnswered && q.studentAnswer === q.correctAnswer;

  // ✅ NEW: helper to classify any question by index (used for the dot navigator)
  const getQuestionStatus = (question) => {
    const answered =
      question.studentAnswer !== null && question.studentAnswer !== undefined;
    if (!answered) return "skipped"; // yellow
    return question.studentAnswer === question.correctAnswer
      ? "correct" // green
      : "wrong"; // red
  };

  const statusStyles = {
    correct: "bg-green-500 text-white border-green-500",
    wrong: "bg-red-500 text-white border-red-500",
    skipped: "bg-yellow-400 text-white border-yellow-400",
  };

  const goBack = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handleExit = () => {
    navigate("/progress");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 py-20 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {review.testTitle} — Review
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Score: {review.score}/{review.totalQuestions} ·{" "}
              {review.percentage.toFixed(1)}%
            </p>
          </div>

          {/* Exit button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500/50 px-3 py-2 rounded-xl transition shrink-0"
          >
            <X size={16} /> Exit
          </button>
        </div>

        {/* Question label + current status */}
        <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          <span>
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          {isAnswered ? (
            isCorrect ? (
              <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                <CheckCircle2 size={14} /> Correct
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-700 dark:text-red-400">
                <XCircle size={14} /> Incorrect
              </span>
            )
          ) : (
            <span className="text-yellow-600 dark:text-yellow-400">Not answered</span>
          )}
        </div>

        {/* ✅ NEW: Circle question navigator — replaces the linear progress bar.
            Click any circle to jump straight to that question. */}
        <div className="flex flex-wrap gap-2 mb-8">
          {review.questions.map((question, idx) => {
            const status = getQuestionStatus(question);
            const isActive = idx === currentQuestion;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                title={`Question ${idx + 1} — ${status}`}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition ${
                  statusStyles[status]
                } ${
                  isActive
                    ? "ring-2 ring-offset-2 dark:ring-offset-gray-950 ring-blue-500 scale-110"
                    : "hover:scale-105"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            Correct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            Incorrect
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            Not answered
          </span>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="min-h-[420px] flex flex-col justify-between border border-gray-200 dark:border-gray-800 rounded-2xl p-8 sm:p-10 shadow-lg bg-white dark:bg-gray-900"
          >
            <div>
              <div className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full mb-4">
                Question {currentQuestion + 1}
              </div>

              <div className="font-semibold text-xl sm:text-2xl text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
                {q.question}
              </div>

              {q.image && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={q.image}
                    alt={`Question ${currentQuestion + 1}`}
                    className="max-h-72 rounded-xl border dark:border-gray-700 object-contain"
                  />
                </div>
              )}

              <ul className="space-y-3">
                {Object.entries(q.options || {}).map(([key, value]) => {
                  if (!value) return null;

                  const isCorrectOption = key === q.correctAnswer;
                  const isStudentPick = key === q.studentAnswer;
                  const isWrongPick = isStudentPick && !isCorrectOption;

                  let optionStyle = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300";
                  if (isCorrectOption) {
                    optionStyle = "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-800 dark:text-green-400";
                  } else if (isWrongPick) {
                    optionStyle = "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400";
                  }

                  return (
                    <li key={key}>
                      <div
                        className={`flex items-center justify-between gap-3 p-4 border-2 rounded-xl ${optionStyle}`}
                      >
                        <span className="font-medium">
                          {key}. {value}
                        </span>
                        <span className="flex items-center gap-2 text-xs shrink-0">
                          {isStudentPick && (
                            <span className="italic text-gray-500 dark:text-gray-400">
                              Your answer
                            </span>
                          )}
                          {isCorrectOption && (
                            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                          )}
                          {isWrongPick && (
                            <XCircle size={16} className="text-red-600 dark:text-red-400" />
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-3 mt-8 sticky bottom-4 bg-slate-100/80 dark:bg-gray-900/80 backdrop-blur rounded-xl p-3">
          <button
            onClick={goBack}
            disabled={isFirstQuestion}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Back
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleExit}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
            >
              Finish Review
            </button>
          ) : (
            <button
              onClick={goNext}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}