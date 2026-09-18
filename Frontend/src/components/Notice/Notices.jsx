import React, { useEffect, useState } from "react";
import { NOTICE_API_END_POINT } from "../../utils/constants";
import axios from "axios";
import { Megaphone, Calendar, AlertCircle, X } from "lucide-react";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${NOTICE_API_END_POINT}/all`, {
          withCredentials: true,
        });
        setNotices(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center text-orange-500 animate-pulse">
        ⏳ Loading notices…
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
            📢 Latest Notices
          </h1>
          <p className="mt-2 text-orange-100">
            Stay updated with announcements and important updates.
          </p>
        </div>

        {/* 🔹 No Data */}
        {notices.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <Megaphone className="mx-auto w-12 h-12 mb-3" />
            <p className="text-lg font-medium">
              No notices yet.
            </p>
            <p className="text-sm">Check back later 🔍</p>
          </div>
        )}

        {/* 🔹 Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-orange-100/40 dark:bg-black/60 
              backdrop-blur-xl 
              border border-orange-300/40 dark:border-white/10 
              shadow-lg rounded-2xl p-6 
              hover:shadow-2xl hover:scale-[1.03] 
              transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <Megaphone className="text-orange-500 w-6 h-6" />
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  {notice.title}
                </h2>
              </div>

              <div className="flex items-start gap-2 mt-3 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 mt-1 flex-shrink-0 text-gray-400" />
                <p className="line-clamp-1">{formatDate(notice.createdAt)}</p>
              </div>

              <div className="mt-auto pt-6 flex justify-end">
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="px-5 py-2.5 flex items-center gap-2 
                  bg-orange-500 hover:bg-orange-600 
                  text-white font-medium rounded-xl shadow 
                  transition"
                >
                  <Megaphone className="w-5 h-5" />
                  Show Notice
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🔹 Full Notice Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-2xl text-black dark:text-white border-b border-orange-400 pb-2 mb-4 pr-8">
              {selectedNotice.title}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {selectedNotice.message}
            </p>

            <p className="text-xs text-gray-500 mt-6 text-right italic">
              {formatDate(selectedNotice.createdAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;