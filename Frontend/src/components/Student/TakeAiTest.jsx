import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";
import { setCurrentTest, setResult, setLoading, clearCurrentTest } from "@/redux/aitestSlice";

const TakeAiTest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTest, loading } = useSelector((state) => state.aitest);
  const { user } = useSelector((state) => state.auth);

  const [answers, setAnswers] = useState([]);
  const [stage, setStage] = useState("info"); // "info" | "question"
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visited, setVisited] = useState(new Set());
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  // Fetch test
  useEffect(() => {
    const fetchTest = async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await axios.get(`${AITEST_API_END_POINT}/${id}/attempt`, {
          withCredentials: true,
        });
        dispatch(setCurrentTest(data.test));
        setAnswers(new Array(data.test.questions.length).fill(null));
      } catch (err) {
        console.error(err);
      }
      dispatch(setLoading(false));
    };
    fetchTest();
    return () => dispatch(clearCurrentTest());
  }, [id, dispatch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Mark question as visited
  useEffect(() => {
    if (stage !== "question") return;
    setVisited((prev) => {
      if (prev.has(currentQuestion)) return prev;
      const next = new Set(prev);
      next.add(currentQuestion);
      return next;
    });
  }, [stage, currentQuestion]);

  const handleAutoSubmit = useCallback(() => {
    if (hasSubmittedRef.current) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTest = () => {
    setStage("question");
    const totalSeconds = (currentTest.duration || 30) * 60;
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

  const handleSelect = (qIndex, option) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const goBack = () => setCurrentQuestion((p) => Math.max(p - 1, 0));

  const goNextOrSubmit = () => {
    const isLast = currentQuestion === currentTest.questions.length - 1;
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentQuestion((p) => p + 1);
    }
  };

  const jumpToQuestion = (idx) => setCurrentQuestion(idx);

  const handleSubmit = async () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${AITEST_API_END_POINT}/${id}/submit`,
        { answers },
        { withCredentials: true }
      );
      dispatch(setResult(data));
      navigate(`/student/ai-test/${id}/review`, { state: { result: data } });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      hasSubmittedRef.current = false;
    }
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds === null) return "--:--";
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading || !currentTest) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading test...</p>
      </div>
    );
  }

  const totalQuestions = currentTest.questions.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const isTimeCritical = secondsLeft !== null && secondsLeft <= 60;

  const getCircleStatus = (idx) => {
    if (answers[idx] !== null && answers[idx] !== undefined) return "answered";
    if (visited.has(idx)) return "skipped";
    return "unvisited";
  };

  const circleStyles = {
    answered: "bg-green-500 text-white border-green-500",
    skipped: "bg-yellow-400 text-white border-yellow-400",
    unvisited:
      "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-16 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-3">
            <Sparkles size={24} className="text-orange-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white mb-2">
            {currentTest.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentTest.subject} • {currentTest.topic}
          </p>
        </div>

        {/* ================= STAGE 1: Info ================= */}
        {stage === "info" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-orange-100 dark:border-orange-500/20 rounded-2xl p-8 sm:p-10 shadow-lg bg-white dark:bg-gray-900 max-w-xl mx-auto"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Before you begin
            </h3>

            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {user?.fullname || "—"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              <span className="font-medium">Email:</span> {user?.email || "—"}
            </p>

            <div className="flex flex-wrap gap-3 mt-5 text-sm">
              <span className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg px-3 py-2">
                <Clock size={16} />
                {currentTest.duration || 30} minutes
              </span>
              <span className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                {totalQuestions} questions
              </span>
              <span className="capitalize text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                {currentTest.difficulty}
              </span>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={startTest}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full shadow transition"
              >
                Start Test →
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STAGE 2: One question per page ================= */}
        {stage === "question" && (
          <div className="flex flex-col">
            {/* Timer */}
            <div
              className={`flex items-center justify-center gap-2 mb-6 mx-auto px-5 py-2.5 rounded-full font-semibold text-sm shadow ${
                isTimeCritical
                  ? "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 animate-pulse"
                  : "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
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

            {/* Circle navigator */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentTest.questions.map((_, idx) => {
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
                        ? "ring-2 ring-offset-2 dark:ring-offset-black ring-orange-500 scale-110"
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
                className="min-h-[380px] flex flex-col justify-between border border-orange-100 dark:border-orange-500/20 rounded-2xl p-8 sm:p-10 shadow-lg bg-white dark:bg-gray-900"
              >
                <div>
                  <div className="inline-block text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full mb-4">
                    Question {currentQuestion + 1}
                  </div>

                  <div className="font-semibold text-xl sm:text-2xl text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
                    {currentTest.questions[currentQuestion].questionText}
                  </div>

                  <ul className="space-y-3">
                    {currentTest.questions[currentQuestion].options.map((opt, j) => {
                      const selected = answers[currentQuestion] === opt;
                      return (
                        <li key={j}>
                          <label
                            className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-xl transition ${
                              selected
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${currentQuestion}`}
                              checked={selected}
                              onChange={() => handleSelect(currentQuestion, opt)}
                              className="h-4 w-4 accent-orange-500"
                            />
                            <span
                              className={`font-medium ${
                                selected
                                  ? "text-orange-700 dark:text-orange-400"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {opt}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-3 mt-8 sticky bottom-4 bg-white/80 dark:bg-black/80 backdrop-blur rounded-xl p-3">
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
                    setCurrentQuestion((p) => Math.min(p + 1, totalQuestions - 1))
                  }
                  disabled={isLastQuestion}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Skip
                </button>

                <button
                  onClick={goNextOrSubmit}
                  disabled={submitting}
                  className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full shadow transition disabled:opacity-60"
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
};

export default TakeAiTest;