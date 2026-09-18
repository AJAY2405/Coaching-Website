import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PlusCircle,
  BarChart3,
  Megaphone,
  UploadCloud,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TEACHER_RESULTS_STUDENT } from "../utils/constants";
import { useTheme } from "./theme-provider";

const actions = [
  {
    to: "/teacher/create-test",
    icon: PlusCircle,
    title: "Create Test",
    desc: "Build a new test with questions, options, and images.",
  },
  {
    to: "/teacher/results",
    icon: BarChart3,
    title: "See Results",
    desc: "Review student scores and test submissions.",
  },
  {
    to: "/create-notice",
    icon: Megaphone,
    title: "Upload Notice",
    desc: "Post a new announcement for students.",
  },
  {
    to: "/notes/upload",
    icon: UploadCloud,
    title: "Upload Notes",
    desc: "Share study material as a downloadable PDF.",
  },
];

function ActionCard({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6 text-center flex flex-col items-center hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xl transition"
    >
      <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-4">
        <Icon size={26} className="text-orange-500" />
      </div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-1">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
    </Link>
  );
}

export default function TeacherHome() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [dailyAttempts, setDailyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${TEACHER_RESULTS_STUDENT}/daily-attempts`, {
        withCredentials: true,
      })
      .then((res) => {
        if (cancelled) return;
        const raw = res.data.data || res.data.attempts || res.data || [];
        const formatted = (Array.isArray(raw) ? raw : []).map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          count: d.count ?? d.students ?? 0,
        }));
        setDailyAttempts(formatted);
      })
      .catch((e) => {
        if (!cancelled) setErr(e?.response?.data?.message || e.message);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-500/20 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-orange-600 dark:text-orange-400">{payload[0].value} student(s)</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-15 space-y-16 transition-colors duration-300">
      {/* Hero */}
      <section className="text-center">
        <img src="/Images/logo.png" alt="Logo" className="w-36 mx-auto" />
        <h1 className="text-3xl font-bold text-black dark:text-white mt-4">
          Welcome back, Teacher 
        </h1>
        <p className="max-w-2xl mx-auto mt-2 text-gray-600 dark:text-gray-400">
          Manage tests, notices, and notes — all from one place.
        </p>
      </section>

      {/* Quick action cards */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {actions.map((a) => (
            <ActionCard key={a.to} {...a} />
          ))}
        </div>
      </section>

      {/* Bar chart: daily test attempts */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-black dark:text-white">
          Daily Students Who Took a Test
        </h2>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <Users size={20} className="text-orange-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Attempts recorded per day
            </p>
          </div>

          {loading ? (
            <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-500 animate-pulse">
              Loading chart…
            </div>
          ) : err ? (
            <div className="h-72 flex items-center justify-center text-red-500 dark:text-red-400 text-sm">
              {err}
            </div>
          ) : dailyAttempts.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              No test attempts recorded yet.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyAttempts}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#3f2a17" : "#fde8d5"}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: isDark ? "#1f2937" : "#fff7ed" }}
                  />
                  <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}