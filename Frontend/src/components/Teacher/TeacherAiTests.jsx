import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, Trash2,Pencil, ClipboardList } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const TeacherAiTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${AITEST_API_END_POINT}`, { withCredentials: true });
      setTests(data.tests);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this AI test? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${AITEST_API_END_POINT}/${id}`, { withCredentials: true });
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold">My AI Tests</h2>
          <button
            onClick={() => navigate("/teacher/create-ai-test")}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full px-5 py-2.5 transition"
          >
            <Plus size={16} /> Generate New
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
              <ClipboardList size={24} className="text-orange-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">No AI tests generated yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">{test.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {test.subject} • {test.topic} • {test.difficulty} • {test.totalMarks} Qs • {test.duration} min
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/teacher/ai-test/${test._id}`)}
                    className="flex items-center gap-1 text-orange-500 border border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-sm rounded-full px-4 py-1.5 transition"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => navigate(`/teacher/ai-test/${test._id}/edit`)}
                    className="flex items-center gap-1 text-blue-500 border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-sm rounded-full px-4 py-1.5 transition"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(test._id)}
                    disabled={deletingId === test._id}
                    className="flex items-center gap-1 text-red-500 border border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm rounded-full px-4 py-1.5 transition disabled:opacity-50"
                  >
                    <Trash2 size={14} /> {deletingId === test._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAiTests;