import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus, Save, ArrowLeft, X, Check } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const EditAiTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null); // { title, subject, topic, difficulty, duration, questions: [] }

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await axios.get(`${AITEST_API_END_POINT}/${id}`, {
          withCredentials: true,
        });
        setForm(data.test);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load test");
      }
      setLoading(false);
    };
    fetchTest();
  }, [id]);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateQuestion = (qIdx, key, value) => {
    setForm((f) => {
      const questions = [...f.questions];
      questions[qIdx] = { ...questions[qIdx], [key]: value };
      return { ...f, questions };
    });
  };

  const updateOption = (qIdx, optIdx, value) => {
    setForm((f) => {
      const questions = [...f.questions];
      const options = [...questions[qIdx].options];
      const oldValue = options[optIdx];
      options[optIdx] = value;

      // keep correctAnswer in sync if it pointed to the edited option
      let correctAnswer = questions[qIdx].correctAnswer;
      if (correctAnswer === oldValue) correctAnswer = value;

      questions[qIdx] = { ...questions[qIdx], options, correctAnswer };
      return { ...f, questions };
    });
  };

  const addOption = (qIdx) => {
    setForm((f) => {
      const questions = [...f.questions];
      questions[qIdx] = {
        ...questions[qIdx],
        options: [...questions[qIdx].options, ""],
      };
      return { ...f, questions };
    });
  };

  const removeOption = (qIdx, optIdx) => {
    setForm((f) => {
      const questions = [...f.questions];
      const removed = questions[qIdx].options[optIdx];
      const options = questions[qIdx].options.filter((_, i) => i !== optIdx);
      let correctAnswer = questions[qIdx].correctAnswer;
      if (correctAnswer === removed) correctAnswer = "";
      questions[qIdx] = { ...questions[qIdx], options, correctAnswer };
      return { ...f, questions };
    });
  };

  const setCorrectAnswer = (qIdx, option) => {
    updateQuestion(qIdx, "correctAnswer", option);
  };

  const addQuestion = () => {
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        { questionText: "", options: ["", ""], correctAnswer: "", explanation: "" },
      ],
    }));
  };

  const removeQuestion = (qIdx) => {
    if (!window.confirm("Remove this question?")) return;
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== qIdx),
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (form.questions.length === 0) return "Add at least one question.";
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.questionText.trim()) return `Question ${i + 1} text is required.`;
      if (q.options.length < 2) return `Question ${i + 1} needs at least 2 options.`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option.`;
      if (!q.correctAnswer.trim() || !q.options.includes(q.correctAnswer))
        return `Question ${i + 1} needs a valid correct answer selected.`;
    }
    return "";
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await axios.put(
        `${AITEST_API_END_POINT}/${id}`,
        {
          title: form.title,
          subject: form.subject,
          topic: form.topic,
          difficulty: form.difficulty,
          duration: form.duration,
          questions: form.questions,
        },
        { withCredentials: true }
      );
      navigate(`/teacher/ai-test/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading test...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-red-500">{error || "Test not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/teacher/ai-tests")}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to My AI Tests
        </button>

        <h2 className="text-2xl font-extrabold mb-6">Edit AI Test</h2>

        {/* Test meta */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
              <input
                value={form.topic}
                onChange={(e) => updateField("topic", e.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => updateField("difficulty", e.target.value)}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (min)</label>
              <input
                type="number"
                min={5}
                value={form.duration}
                onChange={(e) => updateField("duration", Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {form.questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-5"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full">
                  Question {qIdx + 1}
                </span>
                <button
                  onClick={() => removeQuestion(qIdx)}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Remove question"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <textarea
                value={q.questionText}
                onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                placeholder="Question text"
                rows={2}
                className="w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition mb-3 resize-none"
              />

              {/* Options */}
              <div className="space-y-2 mb-3">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = opt !== "" && opt === q.correctAnswer;
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(qIdx, opt)}
                        title="Mark as correct answer"
                        className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                          isCorrect
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600 text-transparent hover:border-green-400"
                        }`}
                      >
                        <Check size={14} />
                      </button>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        className={`flex-1 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 transition bg-white dark:bg-black ${
                          isCorrect
                            ? "border-green-400"
                            : "border-orange-100 dark:border-orange-500/20"
                        }`}
                      />
                      {q.options.length > 2 && (
                        <button
                          onClick={() => removeOption(qIdx, optIdx)}
                          className="shrink-0 text-gray-400 hover:text-red-500 transition"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={() => addOption(qIdx)}
                  className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition"
                >
                  <Plus size={14} /> Add option
                </button>
              </div>

              <textarea
                value={q.explanation || ""}
                onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                placeholder="Explanation (optional)"
                rows={2}
                className="w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition resize-none text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-dashed border-orange-200 dark:border-orange-500/30 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-2xl py-4 font-medium transition"
        >
          <Plus size={18} /> Add Question
        </button>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium rounded-full px-6 py-3.5 transition"
        >
          <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditAiTest;