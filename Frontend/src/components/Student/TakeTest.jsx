import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { STUDENT_API_END_POINT } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [stage, setStage] = useState("info");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // ✅ NEW: tracks which question indices have been viewed at least once,
  // so we can distinguish "skipped" (visited, no answer) from "not visited yet"
  const [visited, setVisited] = useState(new Set());

  const [studentName, setStudentName] = useState(user?.fullname || "");
  const [studentEmail, setStudentEmail] = useState(
    (user?.email || "").trim().toLowerCase()
  );
  const [infoError, setInfoError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(null);
  const timerRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    axios
      .get(`${STUDENT_API_END_POINT}/${id}`, { withCredentials: true })
      .then((res) => {
        if (!cancelled) {
          setTest(res.data);
          setAnswers(new Array(res.data.questions?.length || 0).fill(null));
          setErr("");
        }
      })
      .catch((e) => {
        if (!cancelled) setErr(e?.response?.data?.message || e.message);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ✅ NEW: whenever the current question changes (during the question stage),
  // mark it as visited so its circle can turn yellow if left unanswered.
  useEffect(() => {
    if (stage !== "question") return;
    setVisited((prev) => {
      if (prev.has(currentQuestion)) return prev;
      const next = new Set(prev);
      next.add(currentQuestion);
      return next;
    });
  }, [stage, currentQuestion]);

  const handleChange = (qIdx, key) => {
    const updated = [...answers];
    updated[qIdx] = key;
    setAnswers(updated);
  };

  const handleAutoSubmit = useCallback(() => {
    if (hasSubmittedRef.current) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTest = () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      setInfoError("⚠ Please enter your name and email before continuing.");
      return;
    }
    setInfoError("");
    setStage("question");

    const durationMinutes = test?.duration && test.duration > 0 ? test.duration : 30;
    const totalSeconds = durationMinutes * 60;

    setSecondsLeft(totalSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBack = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const goNextOrSkip = () => {
    const isLast = currentQuestion === test.questions.length - 1;
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // ✅ NEW: jump directly to a question via its circle
  const jumpToQuestion = (idx) => {
    setCurrentQuestion(idx);
  };

  const handleSubmit = async () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${STUDENT_API_END_POINT}/${id}/submit`,
        { answers, studentName, studentEmail },
        { withCredentials: true }
      );
      navigate("/result", { state: res.data });
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
      setSubmitting(false);
      hasSubmittedRef.current = false;
    }
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds === null) return "--:--";
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isTimeCritical = secondsLeft !== null && secondsLeft <= 60;

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 bg-white dark:bg-black">
        No test ID provided.
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 animate-pulse bg-white dark:bg-black">
        Loading test…
      </div>
    );
  if (err)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400 bg-white dark:bg-black">
        Error: {err}
      </div>
    );
  if (!test)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-black">
        Test not found.
      </div>
    );

  const answeredCount = answers.filter((a) => a !== null).length;
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  // ✅ NEW: circle color logic
  // - answered → green
  // - visited but not answered (skipped) → yellow
  // - not visited yet → gray
  const getCircleStatus = (idx) => {
    if (answers[idx] !== null && answers[idx] !== undefined) return "answered";
    if (visited.has(idx)) return "skipped";
    return "unvisited";
  };

  const circleStyles = {
    answered: "bg-green-500 text-white border-green-500",
    skipped: "bg-yellow-400 text-white border-yellow-400",
    unvisited: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 py-25 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
            {test.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{test.description}</p>
        </div>

        {/* ================= STAGE 1: Student Info ================= */}
        {stage === "info" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8 sm:p-10 shadow-lg bg-white dark:bg-gray-900 max-w-xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Before you begin
            </h3>

            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />

            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Your Email
            </label>
            <input
              type="email"
              value={studentEmail}
              readOnly
              className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This is your account email — it's used to track your progress across tests.
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg px-3 py-2 w-fit">
              <Clock size={16} />
              <span>
                Time limit: {test.duration && test.duration > 0 ? test.duration : 30} minutes
              </span>
            </div>

            {infoError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-4">{infoError}</p>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={startTest}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
              >
                Next →
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 2: One question per page ================= */}
        {stage === "question" && (
          <div className="flex flex-col">
            {/* Timer bar */}
            <div
              className={`flex items-center justify-center gap-2 mb-6 mx-auto px-5 py-2.5 rounded-full font-semibold text-sm shadow ${
                isTimeCritical
                  ? "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 animate-pulse"
                  : "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
              }`}
            >
              <Clock size={16} />
              <span>Time left: {formatTime(secondsLeft)}</span>
            </div>

            {/* Progress label */}
            <div className="flex items-center justify-between mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span>
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>

            {/* ✅ NEW: Circle question navigator — replaces the linear progress bar */}
            <div className="flex flex-wrap gap-2 mb-4">
              {test.questions.map((_, idx) => {
                const status = getCircleStatus(idx);
                const isActive = idx === currentQuestion;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToQuestion(idx)}
                    title={`Question ${idx + 1} — ${status}`}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition ${
                      circleStyles[status]
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
            <div className="flex flex-wrap gap-4 mb-8 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                Skipped
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />
                Not visited
              </span>
            </div>

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
                    {test.questions[currentQuestion].question}
                  </div>

                  {test.questions[currentQuestion].image && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={test.questions[currentQuestion].image}
                        alt={`Question ${currentQuestion + 1}`}
                        className="max-h-72 rounded-xl border dark:border-gray-700 object-contain"
                      />
                    </div>
                  )}

                  <ul className="space-y-3">
                    {test.questions[currentQuestion].options &&
                    typeof test.questions[currentQuestion].options ===
                      "object" ? (
                      Object.entries(
                        test.questions[currentQuestion].options
                      ).map(([key, value]) => {
                        const selected = answers[currentQuestion] === key;
                        return (
                          <li key={key}>
                            <label
                              className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-xl transition ${
                                selected
                                  ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10"
                                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${currentQuestion}`}
                                value={key}
                                checked={selected}
                                onChange={() =>
                                  handleChange(currentQuestion, key)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span
                                className={`font-medium ${
                                  selected ? "text-blue-800 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {key}. {value}
                              </span>
                            </label>
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-500 dark:text-gray-400">No options found</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-3 mt-8 sticky bottom-4 bg-slate-100/80 dark:bg-gray-900/80 backdrop-blur rounded-xl p-3">
              <button
                onClick={goBack}
                disabled={currentQuestion === 0}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Back
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(prev + 1, totalQuestions - 1)
                    )
                  }
                  disabled={isLastQuestion}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Skip
                </button>

                <button
                  onClick={goNextOrSkip}
                  disabled={submitting}
                  className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isLastQuestion
                    ? submitting
                      ? "Submitting..."
                      : "Submit Test"
                    : "Save & Next →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}