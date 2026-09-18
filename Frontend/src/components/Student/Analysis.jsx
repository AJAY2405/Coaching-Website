import React, { useEffect, useState } from "react";
import axios from "axios";
import { TEACHER_RESULTS_STUDENT } from "../../utils/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useTheme } from "../theme-provider";

export default function Analysis() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${TEACHER_RESULTS_STUDENT}/student/progress`,
          {
            withCredentials: true,
          }
        );

        setResults(res.data.results || []);
      } catch (error) {
        setErr(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  // ✅ FIX: give each point a unique "idx" key used for axis/tooltip matching.
  // "date" is kept only as a display label — it's no longer what recharts
  // uses to identify which point is being hovered, so duplicate dates
  // (or any x-value collision) can no longer cause the wrong point's data
  // to be shown.
  const chartData = [...results]
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    .map((item, idx) => ({
      idx,
      date: formatDate(item.submittedAt),
      percentage: Number(item.percentage.toFixed(1)),
      score: item.score,
      name: item.testTitle,
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{data.name}</h3>

        <p className="text-blue-600 dark:text-blue-400">Percentage : {data.percentage}%</p>

        <p className="text-gray-700 dark:text-gray-300">Score : {data.score}</p>

        <p className="text-gray-500 dark:text-gray-400 text-sm">{data.date}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-orange-500 text-xl animate-pulse">
          Loading Progress...
        </p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-red-500 dark:text-red-400 text-lg">{err}</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No Progress Available</p>
      </div>
    );
  }

  // ✅ FIX: stripes now keyed on the unique idx, not the (possibly
  // duplicate) date string
  const stripes = [];

  for (let i = 0; i < chartData.length - 1; i++) {
    if (i % 2 === 1) {
      stripes.push(
        <ReferenceArea
          key={i}
          x1={chartData[i].idx}
          x2={chartData[i + 1].idx}
          fill={isDark ? "#1f2937" : "#f3f4f6"}
          fillOpacity={0.6}
          strokeOpacity={0}
        />
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Your Progress</h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Monitor your performance in every examination.
        </p>
      </div>

      {/* Graph */}
      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 5,
              bottom: 20,
            }}
          >
            {stripes}

            <CartesianGrid stroke={isDark ? "#374151" : "#d1d5db"} strokeDasharray="0" />

            {/* ✅ FIX: dataKey is now the unique idx, not date */}
            <XAxis dataKey="idx" hide />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              tick={{
                fontSize: 12,
                fill: isDark ? "#9ca3af" : "#6b7280",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip cursor={false} content={<CustomTooltip />} />

            <Line
              type="linear"
              dataKey="percentage"
              stroke={isDark ? "#60a5fa" : "#2563eb"}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: isDark ? "#60a5fa" : "#2563eb",
                stroke: isDark ? "#60a5fa" : "#2563eb",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}