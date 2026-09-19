
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AiAgentButton = ({ to = "/chat" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Show AI button only on the home page
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <motion.button
      type="button"
      onClick={() => navigate(to)}
      aria-label="Open AI assistant"
      className="cursor-pointer fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center
                 bg-gradient-to-br from-blue-600 to-orange-500 text-white shadow-lg
                 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Pulsing glow ring */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-orange-400 -z-10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.55, 0, 0.55],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-orange-400 -z-10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.55, 0, 0.55],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.1,
        }}
      />

      {/* AI icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      </svg>
    </motion.button>
  );
};

export default AiAgentButton;
