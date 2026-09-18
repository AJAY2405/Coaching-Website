import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart3, Users, Layers, Clock } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const TeacherAiTestResults = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const { data } = await axios.get(`${AITEST_API_END_POINT}/results/teacher/summary`, {
          withCredentials: true,
        });
        setSummaries(data.summaries);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchSummaries();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
            <BarChart3 size={22} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">AI Test Results</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Select a test to see how students performed
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
              <Users size={24} className="text-orange-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't generated any AI tests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/teacher/ai-test-results/${s._id}`)}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-xl transition"
              >
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    <span>{s.subject} • {s.topic}</span>
                    <span className="capitalize flex items-center gap-1">
                      <Layers size={12} /> {s.difficulty}
                    </span>
                    <span>{s.totalMarks} Qs</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-orange-500">
                    <Users size={14} /> {s.attempts} attempt{s.attempts !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Avg: {s.attempts > 0 ? `${s.avgPercentage}%` : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAiTestResults;