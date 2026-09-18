import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { STUDENT_API_END_POINT } from "../../utils/constants";
import { BookOpen, FileText, PlayCircle, AlertCircle, Search } from "lucide-react";

export default function StudentPage() {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    axios
      .get(STUDENT_API_END_POINT, { withCredentials: true })
      .then((res) => {
        setTests(res.data);
        setFilteredTests(res.data);
      })
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = tests.filter((test) =>
      test.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTests(filtered);
  }, [searchTerm, tests]);

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center text-orange-500 animate-pulse">
        ⏳ Loading tests…
      </div>
    );

  if (err)
    return (
      <div className="p-12 flex flex-col items-center text-red-500 font-semibold">
        <AlertCircle className="w-10 h-10 mb-2" />
        ❌ Error: {err}
      </div>
    );

  return (
    <div
      className="min-h-screen w-full 
      bg-white dark:bg-black 
      text-black dark:text-white 
      transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-10">

        {/* 🔹 Header */}
        <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl shadow-lg p-10 text-center text-white mt-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            📚 Available Tests
          </h1>
          <p className="mt-2 text-orange-100">
            Choose a test and start practicing to boost your knowledge.
          </p>
        </div>

        {/* 🔹 Search */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tests by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 
              rounded-lg py-2 pl-10 pr-4 
              bg-white dark:bg-black 
              text-black dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* 🔹 No Data */}
        {filteredTests.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <BookOpen className="mx-auto w-12 h-12 mb-3" />
            <p className="text-lg font-medium">
              No tests found matching your search.
            </p>
            <p className="text-sm">Try different keywords 🔍</p>
          </div>
        )}

        {/* 🔹 Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTests.map((t) => (
            <div
              key={t._id}
              className="bg-orange-100/40 dark:bg-black/60 
              backdrop-blur-xl 
              border border-orange-300/40 dark:border-white/10 
              shadow-lg rounded-2xl p-6 
              hover:shadow-2xl hover:scale-[1.03] 
              transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="text-orange-500 w-6 h-6" />
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  {t.title}
                </h2>
              </div>

              <div className="flex items-start gap-2 mt-3 text-gray-700 dark:text-gray-300">
                <FileText className="w-5 h-5 mt-1 flex-shrink-0 text-gray-400" />
                <p className="line-clamp-1">{t.description}</p>
              </div>

              <div className="mt-auto pt-6 flex justify-end">
                <Link
                  to={`/student/tests/${t._id}`}
                  className="px-5 py-2.5 flex items-center gap-2 
                  bg-orange-500 hover:bg-orange-600 
                  text-white font-medium rounded-xl shadow 
                  transition"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Test
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}