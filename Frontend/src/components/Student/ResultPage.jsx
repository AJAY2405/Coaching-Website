
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";
 
export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
 
  if (!result)
    return (
      <p className="p-6 text-center bg-white dark:bg-black text-black dark:text-white min-h-screen">
        No result to display.
      </p>
    );
 
  const { totalQuestions, score, percentage, resultId } = result; // ✅ NEW: pull resultId
  const incorrect = totalQuestions - score;
 
  // ----- SVG donut chart (correct vs incorrect), no chart library needed -----
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const correctFraction = totalQuestions > 0 ? score / totalQuestions : 0;
  const correctDash = circumference * correctFraction;
  const incorrectDash = circumference - correctDash;
 
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-lg mx-auto p-6 text-center pt-12">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Test Result</h2>
 
        {/* Donut chart */}
        <div className="flex justify-center mb-6">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Incorrect (background ring) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={isDark ? "#450a0a" : "#fecaca"} /* red-950 / red-200 */
              strokeWidth="24"
            />
            {/* Correct (foreground arc) */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#22c55e" /* green-500 */
              strokeWidth="24"
              strokeDasharray={`${correctDash} ${incorrectDash}`}
              strokeDashoffset={circumference / 4}
              transform="rotate(-90 100 100)"
              strokeLinecap="round"
            />
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="fill-gray-800 dark:fill-gray-100"
              fontSize="28"
              fontWeight="bold"
            >
              {percentage.toFixed(0)}%
            </text>
            <text
              x="100"
              y="118"
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400"
              fontSize="13"
            >
              Score
            </text>
          </svg>
        </div>
 
        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Correct: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-200 dark:bg-red-900 inline-block"></span>
            <span className="text-sm text-gray-700 dark:text-gray-300">Incorrect: {incorrect}</span>
          </div>
        </div>
 
        {/* Stats */}
        <div className="border dark:border-gray-800 rounded-xl p-4 shadow bg-gray-50 dark:bg-gray-900 space-y-1 mb-6">
          <p className="text-gray-700 dark:text-gray-300">Total Questions: {totalQuestions}</p>
          <p className="text-gray-700 dark:text-gray-300">Score: {score}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Percentage: <span className="font-semibold text-black dark:text-white">{percentage.toFixed(2)}%</span>
          </p>
        </div>
 
        {/* ✅ NEW: Review + Home buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resultId && (
            <button
              onClick={() => navigate(`/review/${resultId}`)}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-xl hover:bg-orange-600 transition"
            >
              Review Your Test
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
 