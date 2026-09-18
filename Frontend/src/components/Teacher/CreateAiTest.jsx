import { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const CreateAiTest = () => {
  const [form, setForm] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    numQuestions: 10,
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${AITEST_API_END_POINT}/generate`, form, {
        withCredentials: true,
      });
      setTest(data.aiTest);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
            <Sparkles size={22} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">AI Test Generator</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Generate a test instantly with AI
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <input
              placeholder="e.g. Science"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
            <input
              placeholder="e.g. Photosynthesis"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Questions</label>
              <input
                type="number"
                min={1}
                value={form.numQuestions}
                onChange={(e) => setForm({ ...form, numQuestions: e.target.value })}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (min)</label>
              <input
                type="number"
                min={5}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 w-full rounded-xl border border-orange-100 dark:border-orange-500/20 bg-white dark:bg-black px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium rounded-full px-6 py-3 transition"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Generate AI Test
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        {test && (
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6">
            <h3 className="text-lg font-bold mb-4">{test.title}</h3>
            <div className="space-y-3">
              {test.questions.map((q, i) => (
                <div key={i} className="border-b border-orange-100 dark:border-orange-500/10 pb-3">
                  <p className="font-medium">
                    {i + 1}. {q.questionText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAiTest;