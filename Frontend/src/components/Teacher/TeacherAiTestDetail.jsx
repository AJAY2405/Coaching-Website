import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import { AITEST_API_END_POINT } from "@/utils/constants";

const TeacherAiTestDetail = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await axios.get(`${AITEST_API_END_POINT}/${id}`, {
          withCredentials: true,
        });
        setTest(data.test);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTest();
  }, [id]);

  if (!test) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold">{test.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {test.subject} • {test.topic} • {test.difficulty}
        </p>

        <div className="space-y-4">
          {test.questions.map((q, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-5"
            >
              <p className="font-medium mb-3">
                {i + 1}. {q.questionText}
              </p>
              <ul className="space-y-1.5">
                {q.options.map((opt, j) => {
                  const isCorrect = opt === q.correctAnswer;
                  return (
                    <li
                      key={j}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {isCorrect && <CheckCircle2 size={14} />}
                      {opt}
                    </li>
                  );
                })}
              </ul>
              {q.explanation && (
                <p className="text-xs text-gray-500 mt-3 bg-orange-50 dark:bg-orange-500/10 rounded-lg px-3 py-2">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAiTestDetail;