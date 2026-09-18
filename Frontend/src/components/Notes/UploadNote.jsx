import React, { useEffect, useState } from "react";
import axios from "axios";
import { NOTES_API_END_POINT } from "../../utils/constants";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UploadNote = () => {
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [pdf, setPdf] = useState(null);

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await axios.get(NOTES_API_END_POINT, {
        withCredentials: true,
      });
      setNotes(res.data.notes || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf", pdf);

      await axios.post(`${NOTES_API_END_POINT}/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("📄 Note uploaded successfully!");
      setTitle("");
      setPdf(null);
      fetchNotes(); // refresh list after upload
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Upload failed");
    }
  };

  const handleDelete = async (noteId, noteTitle) => {
    const confirmed = window.confirm(`Delete "${noteTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(noteId);
      await axios.delete(`${NOTES_API_END_POINT}/${noteId}`, {
        withCredentials: true,
      });
      toast.success("Note deleted");
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete note");
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
    <div className="min-h-screen bg-gray-100 dark:bg-black px-4 py-20 transition-colors duration-300">
      {/* Upload form */}
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-2xl shadow-lg dark:shadow-none p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            📄 Upload Your Note
          </h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
            />

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-green-500 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-800"
            >
              Upload PDF
            </button>
          </form>
        </div>
      </div>

      {/* Notes list */}
      <div className="max-w-3xl mx-auto mt-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          All Uploaded Notes
        </h3>

        {loadingNotes ? (
          <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No notes uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => {
              const isOwner = note.uploadedBy?._id === user?._id;
              return (
                <div
                  key={note._id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex justify-between items-center shadow-sm dark:shadow-none"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{note.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded by {note.uploadedBy?.name || "Unknown"} ·{" "}
                      {formatDate(note.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={note.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View PDF
                    </a>

                    {isOwner && (
                      <button
                        onClick={() => handleDelete(note._id, note.title)}
                        disabled={deletingId === note._id}
                        className="bg-red-600 dark:bg-red-700 text-white px-3 py-1.5 rounded text-sm hover:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingId === note._id ? "Deleting..." : "Delete"}
                      </button>
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

export default UploadNote;