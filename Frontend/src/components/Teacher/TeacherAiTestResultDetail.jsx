import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Trophy } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const TeacherAiTestResultDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${AITEST_API_END_POINT}/results/teacher/test/${testId}`,
          { withCredentials: true }
        );
        setTest(data.test);
        setResults(data.results);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/teacher/ai-test-results")}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to all tests
        </button>

        <h2 className="text-2xl font-extrabold">{test?.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          {test?.subject} • {test?.topic} • {test?.difficulty} • {results.length} attempt
          {results.length !== 1 ? "s" : ""}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
              <Trophy size={24} className="text-orange-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No students have attempted this test yet.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 overflow-hidden">
            <div className="grid grid-cols-4 gap-2 px-5 py-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 border-b border-orange-100 dark:border-orange-500/10">
              <span className="col-span-2">Student</span>
              <span>Score</span>
              <span>Date</span>
            </div>
            {results.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-4 gap-2 px-5 py-4 items-center border-b last:border-none border-orange-50 dark:border-orange-500/5 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition"
              >
                <div className="col-span-2">
                  <p className="font-medium truncate">{r.student?.fullname || "Unknown"}</p>
                  <p className="text-xs text-gray-500 truncate">{r.student?.email}</p>
                </div>
                <p className="text-sm font-semibold text-orange-500">
                  {r.score}/{r.total}{" "}
                  <span className="text-gray-500 font-normal">({r.percentage}%)</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAiTestResultDetail;