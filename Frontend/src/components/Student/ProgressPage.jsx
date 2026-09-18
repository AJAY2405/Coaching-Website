import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import { TEACHER_RESULTS_STUDENT } from "../../utils/constants";
import {
  TrendingUp,
  Award,
  ListChecks,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronRight, // ✅ NEW: visual affordance that the card is clickable
} from "lucide-react";

export default function ProgressPage() {
  const navigate = useNavigate(); // ✅ NEW

  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    totalTests: 0,
    averagePercentage: 0,
    bestPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [percentageFilter, setPercentageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${TEACHER_RESULTS_STUDENT}/student/progress`,
          { withCredentials: true }
        );
        setResults(res.data.results || []);
        setSummary(
          res.data.summary || { totalTests: 0, averagePercentage: 0, bestPercentage: 0 }
        );
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const barColor = (pct) => {
    if (pct >= 70) return "bg-green-500";
    if (pct >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredResults = useMemo(() => {
    let list = [...results];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((r) => r.testTitle?.toLowerCase().includes(q));
    }

    if (percentageFilter === "high") {
      list = list.filter((r) => r.percentage >= 70);
    } else if (percentageFilter === "medium") {
      list = list.filter((r) => r.percentage >= 50 && r.percentage < 70);
    } else if (percentageFilter === "low") {
      list = list.filter((r) => r.percentage < 50);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        case "highest":
          return b.percentage - a.percentage;
        case "lowest":
          return a.percentage - b.percentage;
        case "newest":
        default:
          return new Date(b.submittedAt) - new Date(a.submittedAt);
      }
    });

    return list;
  }, [results, searchTerm, percentageFilter, sortBy]);

  // ✅ NEW: go to the review page for this specific attempt
  const handleViewReview = (resultId) => {
    if (!resultId) return;
    navigate(`/review/${resultId}`);
  };

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center text-orange-500 animate-pulse bg-white dark:bg-black min-h-screen">
        ⏳ Loading your progress…
      </div>
    );

  if (err)
    return (
      <div className="p-12 flex flex-col items-center text-red-500 dark:text-red-400 font-semibold bg-white dark:bg-black min-h-screen">
        <AlertCircle className="w-10 h-10 mb-2" />
        ❌ Error: {err}
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        {/* Header */}
        <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl shadow-lg p-10 text-center text-white mt-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">📈 My Progress</h1>
          <p className="mt-2 text-orange-100">
            Your performance across every test you've taken.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-orange-100/60 dark:bg-orange-500/10 border border-orange-300/40 dark:border-orange-500/20 rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center shadow">
            <ListChecks className="text-orange-500 w-7 h-7 sm:w-8 sm:h-8 mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{summary.totalTests}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tests Taken</p>
          </div>
          <div className="bg-orange-100/60 dark:bg-orange-500/10 border border-orange-300/40 dark:border-orange-500/20 rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center shadow">
            <TrendingUp className="text-orange-500 w-7 h-7 sm:w-8 sm:h-8 mb-2" />
            <p className="text-xl sm:text-2xl font-bold">
              {summary.averagePercentage.toFixed(1)}%
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Average Score</p>
          </div>
          <div className="bg-orange-100/60 dark:bg-orange-500/10 border border-orange-300/40 dark:border-orange-500/20 rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center shadow col-span-2 sm:col-span-1">
            <Award className="text-orange-500 w-7 h-7 sm:w-8 sm:h-8 mb-2" />
            <p className="text-xl sm:text-2xl font-bold">
              {summary.bestPercentage.toFixed(1)}%
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Best Score</p>
          </div>
        </div>

        {/* Per-test breakdown */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Test History</h2>
          </div>

          {/* Search + Filters bar */}
          {results.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search box */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by test name…"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Percentage filter */}
              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={percentageFilter}
                  onChange={(e) => setPercentageFilter(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (≥ 70%)</option>
                  <option value="medium">Medium (50–69%)</option>
                  <option value="low">Low (&lt; 50%)</option>
                </select>
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              You haven't taken any tests yet. Once you do, your progress will
              show up here.
            </p>
          ) : filteredResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              No tests match your search or filter. Try adjusting them.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((r) => (
                // ✅ NEW: whole card is clickable, routes to that attempt's review
                <div
                  key={r._id}
                  onClick={() => handleViewReview(r._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleViewReview(r._id);
                    }
                  }}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm cursor-pointer hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2 gap-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {r.testTitle}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(r.submittedAt)}
                      </span>
                      {/* ✅ NEW: visual cue that this card navigates somewhere */}
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-1">
                    <div
                      className={`h-3 rounded-full transition-all ${barColor(
                        r.percentage
                      )}`}
                      style={{ width: `${Math.min(r.percentage, 100)}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Score: {r.score} · {r.percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}