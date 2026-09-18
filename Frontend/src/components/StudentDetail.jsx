import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, GraduationCap, Trophy } from "lucide-react";
import { getAchieverById } from "./Achieversdata";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer the record passed via navigation state (instant, no lookup),
  // fall back to looking it up in the data file for direct links / refreshes.
  const student = location.state?.student || getAchieverById(id);

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-black text-black dark:text-white px-6">
        <p className="text-lg font-medium">Student not found.</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-12 transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-orange-500 hover:text-orange-600 mb-8"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-orange-100 dark:border-orange-500/20 p-8 text-center">
        {/* Image */}
        <img
          src={student.image}
          alt={student.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mx-auto bg-orange-50"
        />

        {/* Name */}
        <h1 className="mt-6 text-3xl font-extrabold">{student.name}</h1>

        {/* Achievement */}
        <p className="mt-2 text-orange-500 font-semibold text-lg">
          {student.achievement}
        </p>

        {/* Mark */}
        <div className="mt-6 flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-500/10 rounded-xl py-3">
          <GraduationCap size={20} className="text-orange-500" />
          <span className="font-semibold">{student.mark}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;