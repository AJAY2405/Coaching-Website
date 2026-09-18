import React, { useEffect, useState } from "react";
import axios from "axios";
import { NOTES_API_END_POINT } from "../../utils/constants";
import { BookOpen, FileText, ExternalLink, Search } from "lucide-react";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(NOTES_API_END_POINT, {
          withCredentials: true,
        });

        let notesData = [];
        if (Array.isArray(res.data)) {
          notesData = res.data;
        } else if (Array.isArray(res.data.notes)) {
          notesData = res.data.notes;
        }

        setNotes(notesData);
        setFilteredNotes(notesData);
      } catch (err) {
        setError("⚠️ Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchTerm, notes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-orange-500 animate-pulse">
        ⏳ Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen 
      bg-white dark:bg-black 
      text-black dark:text-white 
      px-6 py-10 
      transition-colors duration-300"
    >
       <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl shadow-lg p-10 text-center text-white mt-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            📚 Available Notes
          </h1>
          <p className="mt-2 text-orange-100">
            Choose a Notes and start reading to boost your knowledge.
          </p>
        </div>
      {/* 🔹 Search */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes by title..."
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

      {/* 🔹 Notes Grid */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {filteredNotes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">
            No notes found.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="bg-orange-100/40 dark:bg-black/60 
              backdrop-blur-xl 
              border border-orange-300/40 dark:border-white/10 
              rounded-2xl shadow-lg p-5 flex flex-col justify-between 
              hover:shadow-2xl hover:scale-[1.03] 
              transition-all duration-300"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                {note.title}
              </h3>

              {/* Subtitle */}
              <p className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-gray-400" />
                {note.uploadedBy?.fullname || "Shared Note"}
              </p>

              {/* Button */}
              <a
                href={note.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 
                px-4 py-2 
                bg-orange-500 hover:bg-orange-600 
                text-white font-medium rounded-lg shadow 
                transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open Note
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;