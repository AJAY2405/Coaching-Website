import React from "react";
import { useTheme } from "./theme-provider"; // adjust path to match your project structure

function About() {
  const { theme } = useTheme();

  // Resolve "system" to an actual light/dark value so the signature
  // always shows the correct image.
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  return (
    <div
      className="min-h-screen w-full 
      bg-white dark:bg-black 
      text-black dark:text-white 
      transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/Images/logo.png"
            alt="Institute Logo"
            className="w-36 h-auto mb-4 select-none"
          />

          <h1 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white">
            About Our Institute
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Excellence in Guidance for CHS • UP Board • CBSE • Bihar Board • JNV
          </p>
        </div>

        {/* Body */}
        <div className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-7">

          <p>
            Founded with a simple promise—to help every learner discover their
            fullest potential—our institute has grown into a trusted learning
            destination for students preparing for CHS, UP Board, CBSE, Bihar
            Board, and JNV.
          </p>

          <p>
            Our mission is to deliver high-quality, affordable, and ethical
            education that strengthens fundamentals, builds confidence, and
            inspires character.
          </p>

          {/* Section Title */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Our Values
          </h2>

          <p>
            Integrity, mastery, empathy, and resilience shape everything we do.
          </p>

          {/* Programs */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Programs We Offer
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold text-orange-500">
                CHS Preparation:
              </span>{" "}
              Focus on fundamentals, speed, and accuracy.
            </li>

            <li>
              <span className="font-semibold text-orange-500">
                UP Board & Bihar Board:
              </span>{" "}
              Concept clarity + structured revision.
            </li>

            <li>
              <span className="font-semibold text-orange-500">
                CBSE Curriculum:
              </span>{" "}
              NCERT mastery + application-based learning.
            </li>

            <li>
              <span className="font-semibold text-orange-500">
                JNV Selection:
              </span>{" "}
              Reasoning + analytical skill development.
            </li>
          </ul>

          {/* Teaching */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Teaching Philosophy
          </h2>

          <p>
            We focus on conceptual learning, active participation, and continuous
            feedback to ensure deep understanding.
          </p>

          {/* Faculty */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Faculty & Mentoring
          </h2>

          <p>
            Our experienced teachers guide students with personal mentoring and
            structured learning strategies.
          </p>

          {/* Results */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Results & Achievements
          </h2>

          <p>
            Our students consistently achieve top ranks and selections across
            various boards and entrance exams.
          </p>

          {/* Community */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Community & Parents
          </h2>

          <p>
            We maintain strong communication with parents to ensure student
            success through collaboration.
          </p>

          {/* Contact */}
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8">
            Admissions & Contact
          </h2>

          <p>
            Reach out to us to explore programs, schedules, and academic plans
            tailored for your goals.
          </p>

          <p className="mt-6">
            Let’s learn deeply, practice consistently, and grow together.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-12 flex flex-col items-center text-center">
          <img
            src={isDark ? "/Images/signature2.png" : "/Images/signature.png"}
            alt="Signature"
            className="h-20 w-auto mb-2 select-none"
          />

          <p className="text-black dark:text-white font-semibold">
            Ram Karan Sir
          </p>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Director
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;