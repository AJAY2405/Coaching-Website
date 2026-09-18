import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ClipboardList,
  Trophy,
  Search,
  SlidersHorizontal,
  ChevronRight,
  BarChart3,
} from "lucide-react";

import { AITEST_API_END_POINT } from "@/utils/constants";

const MyAiTestResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  const navigate = useNavigate();

  // =========================
  // Fetch Results
  // =========================
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(
          `${AITEST_API_END_POINT}/results/student`,
          {
            withCredentials: true,
          }
        );

        setResults(data.results || []);
      } catch (err) {
        console.error("Failed to fetch AI test results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // =========================
  // Statistics
  // =========================

  const totalTests = results.length;

  const averageScore = useMemo(() => {
    if (!results.length) return 0;

    const total = results.reduce(
      (sum, result) => sum + Number(result.percentage || 0),
      0
    );

    return (total / results.length).toFixed(1);
  }, [results]);

  const bestScore = useMemo(() => {
    if (!results.length) return 0;

    return Math.max(
      ...results.map((result) =>
        Number(result.percentage || 0)
      )
    );
  }, [results]);

  // =========================
  // Filter Results
  // =========================

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter((result) => {
        const title =
          result.test?.title?.toLowerCase() || "";

        const subject =
          result.test?.subject?.toLowerCase() || "";

        const topic =
          result.test?.topic?.toLowerCase() || "";

        return (
          title.includes(query) ||
          subject.includes(query) ||
          topic.includes(query)
        );
      });
    }

    // Score filter
    if (scoreFilter !== "all") {
      filtered = filtered.filter((result) => {
        const percentage = Number(result.percentage || 0);

        if (scoreFilter === "excellent") {
          return percentage >= 80;
        }

        if (scoreFilter === "good") {
          return percentage >= 60 && percentage < 80;
        }

        if (scoreFilter === "average") {
          return percentage >= 40 && percentage < 60;
        }

        if (scoreFilter === "poor") {
          return percentage < 40;
        }

        return true;
      });
    }

    return filtered;
  }, [results, search, scoreFilter]);

  // =========================
  // Score Color
  // =========================

  const getScoreColor = (percentage) => {
    if (percentage >= 80) {
      return "bg-green-500";
    }

    if (percentage >= 60) {
      return "bg-yellow-500";
    }

    if (percentage >= 40) {
      return "bg-orange-500";
    }

    return "bg-red-500";
  };

  const getScoreTextColor = (percentage) => {
    if (percentage >= 80) {
      return "text-green-400";
    }

    if (percentage >= 60) {
      return "text-yellow-400";
    }

    if (percentage >= 40) {
      return "text-orange-400";
    }

    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">

        {/* ================================= */}
        {/* Hero */}
        {/* ================================= */}

        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl px-6 py-8 sm:py-10 text-center mb-8">

          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl">
              📈
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold">
              My AI Test Results
            </h1>
          </div>

          <p className="text-sm sm:text-base text-orange-50">
            Track your performance across every AI test you've taken.
          </p>
        </div>

        {/* ================================= */}
        {/* Statistics */}
        {/* ================================= */}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-10">

            {/* Tests Taken */}
            <div className="bg-[#170900] border border-orange-900/70 rounded-2xl p-5 text-center">

              <div className="flex justify-center mb-3">
                <ClipboardList
                  size={25}
                  className="text-orange-500"
                />
              </div>

              <p className="text-xl sm:text-2xl font-bold">
                {totalTests}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Tests Taken
              </p>
            </div>

            {/* Average Score */}
            <div className="bg-[#170900] border border-orange-900/70 rounded-2xl p-5 text-center">

              <div className="flex justify-center mb-3">
                <BarChart3
                  size={25}
                  className="text-orange-500"
                />
              </div>

              <p className="text-xl sm:text-2xl font-bold">
                {averageScore}%
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Average Score
              </p>
            </div>

            {/* Best Score */}
            <div className="bg-[#170900] border border-orange-900/70 rounded-2xl p-5 text-center col-span-2 sm:col-span-1">

              <div className="flex justify-center mb-3">
                <Trophy
                  size={25}
                  className="text-orange-500"
                />
              </div>

              <p className="text-xl sm:text-2xl font-bold">
                {bestScore}%
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Best Score
              </p>
            </div>

          </div>
        )}

        {/* ================================= */}
        {/* Test History */}
        {/* ================================= */}

        <div>

          <h2 className="text-xl font-bold mb-5">
            Test History
          </h2>

          {/* Search */}
          {!loading && results.length > 0 && (
            <>
              <div className="relative mb-3">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by test name..."
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 outline-none focus:border-orange-500 transition"
                />

              </div>

              {/* Score Filter */}
              <div className="mb-5">

                <div className="relative inline-flex items-center">

                  <SlidersHorizontal
                    size={15}
                    className="absolute left-3 text-gray-400 pointer-events-none"
                  />

                  <select
                    value={scoreFilter}
                    onChange={(e) =>
                      setScoreFilter(e.target.value)
                    }
                    className="appearance-none bg-[#111827] border border-gray-700 rounded-xl py-2.5 pl-9 pr-8 text-xs text-white outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="all">
                      All Scores
                    </option>

                    <option value="excellent">
                      Excellent (80%+)
                    </option>

                    <option value="good">
                      Good (60–79%)
                    </option>

                    <option value="average">
                      Average (40–59%)
                    </option>

                    <option value="poor">
                      Poor (&lt;40%)
                    </option>
                  </select>

                </div>

              </div>
            </>
          )}

          {/* ================================= */}
          {/* Loading */}
          {/* ================================= */}

          {loading ? (
            <div className="space-y-3">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-xl bg-gray-900 animate-pulse"
                />
              ))}

            </div>
          ) : results.length === 0 ? (

            /* ================================= */
            /* No Results */
            /* ================================= */

            <div className="text-center py-16">

              <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <ClipboardList
                  size={28}
                  className="text-orange-500"
                />
              </div>

              <p className="text-gray-400">
                You haven't attempted any AI tests yet.
              </p>

              <button
                onClick={() =>
                  navigate("/student/ai-tests")
                }
                className="mt-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl px-6 py-3 transition"
              >
                Browse AI Tests
              </button>

            </div>

          ) : filteredResults.length === 0 ? (

            /* ================================= */
            /* No Filter Results */
            /* ================================= */

            <div className="text-center py-14">

              <Search
                size={30}
                className="mx-auto text-gray-500 mb-3"
              />

              <p className="text-gray-400">
                No tests found.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setScoreFilter("all");
                }}
                className="mt-4 text-sm text-orange-500 hover:text-orange-400"
              >
                Clear Filters
              </button>

            </div>

          ) : (

            /* ================================= */
            /* Results */
            /* ================================= */

            <div className="space-y-3">

              {filteredResults.map((result) => {

                const percentage = Number(
                  result.percentage || 0
                );

                const date = result.createdAt
                  ? new Date(
                      result.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "";

                return (
                  <div
                    key={result._id}
                    onClick={() =>
                      navigate(
                        `/student/ai-test-result/${result._id}`
                      )
                    }
                    className="bg-black border border-gray-800 hover:border-orange-700 rounded-xl px-4 py-4 cursor-pointer transition-all hover:bg-[#080808]"
                  >

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-3 mb-3">

                      <div className="min-w-0">

                        <p className="font-semibold text-sm truncate">
                          {result.test?.title ||
                            "AI Test"}
                        </p>

                        <p className="text-[11px] text-gray-400 mt-1">
                          {result.test?.subject ||
                            "General"}

                          {result.test?.topic &&
                            ` • ${result.test.topic}`}
                        </p>

                      </div>

                      <div className="flex items-center gap-2 shrink-0">

                        <span className="text-[11px] text-gray-400">
                          {date}
                        </span>

                        <ChevronRight
                          size={16}
                          className="text-gray-500"
                        />

                      </div>

                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 w-full bg-gray-700 rounded-full overflow-hidden">

                      <div
                        className={`h-full ${getScoreColor(
                          percentage
                        )} rounded-full transition-all`}
                        style={{
                          width: `${Math.min(
                            percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between mt-2">

                      <p className="text-xs text-gray-400">
                        Score:{" "}
                        <span className="text-gray-300">
                          {result.score || 0}/
                          {result.total || 0}
                        </span>
                      </p>

                      <p
                        className={`text-xs font-semibold ${getScoreTextColor(
                          percentage
                        )}`}
                      >
                        {percentage.toFixed(1)}%
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyAiTestResults;