import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipboardList, Clock, Layers, Sparkles } from "lucide-react";

import { AITEST_API_END_POINT } from "@/utils/constants";

const AiTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await axios.get(
          `${AITEST_API_END_POINT}/student/all`,
          {
            withCredentials: true,
          }
        );

        setTests(data.tests);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 sm:px-6 py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* ================= Banner ================= */}
        <div className="relative overflow-hidden rounded-3xl mb-10 p-6 sm:p-8 md:p-10 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-xl">
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 right-32 w-48 h-48 bg-white/10 rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={22} />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  AI Powered
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
                All AI Generated Tests
              </h1>

              <p className="text-sm sm:text-base text-orange-50 max-w-2xl">
                Practice smarter with AI-generated tests designed to help you
                improve your knowledge, test your skills, and prepare better.
              </p>
            </div>

            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles
                size={36}
                className="text-white"
              />
            </div>
          </div>
        </div>

        {/* ================= Heading ================= */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Available Tests
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose a test and start your practice.
          </p>
        </div>

        {/* ================= Loading ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList
              size={45}
              className="mx-auto text-gray-400 mb-4"
            />

            <p className="text-gray-600 dark:text-gray-400">
              No AI tests available right now.
            </p>
          </div>
        ) : (
          /* ================= Test Grid ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tests.map((test) => (
              <div
                key={test._id}
                className="group bg-white dark:bg-black rounded-2xl shadow-md hover:shadow-xl border border-orange-100 dark:border-orange-500/20 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top section */}
                <div>
                  <div className="flex items-start gap-4">
                    
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                      <ClipboardList
                        size={22}
                        className="text-orange-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {test.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {test.subject} • {test.topic}
                      </p>
                    </div>
                  </div>

                  {/* Test information */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Layers
                        size={15}
                        className="text-orange-500"
                      />

                      <span className="capitalize">
                        {test.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Clock
                        size={15}
                        className="text-orange-500"
                      />

                      <span>
                        {test.duration} min
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <ClipboardList
                        size={15}
                        className="text-orange-500"
                      />

                      <span>
                        {test.totalMarks} Questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate(`/student/ai-test/${test._id}`)
                  }
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-all duration-200 group-hover:shadow-md"
                >
                  Take Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTestList;