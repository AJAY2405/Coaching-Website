import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { NOTICE_API_END_POINT } from "../../utils/constants";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CreateNotice = () => {
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null); // null = create mode, else editing this notice

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      const res = await axios.get(`${NOTICE_API_END_POINT}/all`, {
        withCredentials: true,
      });
      setNotices(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notices");
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ✅ Update existing notice
        const res = await axios.put(
          `${NOTICE_API_END_POINT}/${editingId}`,
          { title, message },
          { withCredentials: true }
        );
        if (res.data) {
          toast.success("Notice updated successfully!");
          setNotices((prev) =>
            prev.map((n) => (n._id === editingId ? res.data : n))
          );
          resetForm();
        }
      } else {
        // Create new notice
        const res = await axios.post(
          `${NOTICE_API_END_POINT}/create`,
          { title, message },
          { withCredentials: true }
        );
        if (res.data) {
          toast.success("Notice created successfully!");
          setNotices((prev) => [res.data, ...prev]);
          resetForm();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(editingId ? "Failed to update notice" : "Failed to create notice");
    }
  };

  const startEdit = (notice) => {
    setEditingId(notice._id);
    setTitle(notice.title);
    setMessage(notice.message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (noticeId, noticeTitle) => {
    const confirmed = window.confirm(`Delete "${noticeTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(noticeId);
      await axios.delete(`${NOTICE_API_END_POINT}/${noticeId}`, {
        withCredentials: true,
      });
      toast.success("Notice deleted");
      setNotices((prev) => prev.filter((n) => n._id !== noticeId));
      if (editingId === noticeId) resetForm(); // in case they deleted the one they were editing
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to delete notice");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-black dark:via-gray-950 dark:to-black flex flex-col items-center p-6 mt-12 gap-10 transition-colors duration-300">
      {/* Create / Edit form */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-2xl dark:shadow-none rounded-2xl p-10 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          {editingId ? "Edit Notice" : "Create Notice"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Notice Title"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Notice Message"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-center gap-3">
            <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">
              {editingId ? "Update Notice" : "Publish"}
            </Button>
            {editingId && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 dark:bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 dark:hover:bg-gray-500"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* All notices list */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">All Notices</h2>

        {loadingNotices ? (
          <p className="text-gray-600 dark:text-gray-400">Loading notices...</p>
        ) : notices.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No notices yet.</p>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => {
              const canManage = user?.role === "teacher"; // any teacher can edit/delete
              return (
                <div
                  key={notice._id}
                  onClick={() => canManage && startEdit(notice)}
                  className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-none rounded-xl p-5 ${
                    canManage ? "cursor-pointer hover:shadow-xl dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-700 transition" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{notice.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                        {notice.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {notice.createdBy?.name ? `By ${notice.createdBy.name} · ` : ""}
                        {formatDate(notice.createdAt)}
                      </p>
                    </div>

                    {canManage && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(notice);
                          }}
                          className="bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-400 dark:hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notice._id, notice.title);
                          }}
                          disabled={deletingId === notice._id}
                          className="bg-red-600 dark:bg-red-700 text-white px-3 py-1.5 rounded text-sm hover:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50"
                        >
                          {deletingId === notice._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNotice;