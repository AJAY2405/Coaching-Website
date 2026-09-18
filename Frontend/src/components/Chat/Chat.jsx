import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/chat`;
const LOGO_SRC = "/Images/logo.png";

// ASSUMPTION: reads the logged-in user's name from localStorage under the
// key "user" (e.g. { fullname: "Ajay Sahani", ... }), since the backend
// User schema has no profilePicture field yet. If you store auth state
// differently (Redux, context, a different localStorage key/shape), just
// swap the body of this function — everything else stays the same.
const getUserInitials = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return "U";
    const parsed = JSON.parse(stored);
    const name = parsed?.fullname || parsed?.name;
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  } catch {
    return "U";
  }
};

const AssistantAvatar = () => (
  <img
    src={LOGO_SRC}
    alt="Mangaldeep Academy"
    className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-800"
  />
);

const UserAvatar = ({ initials }) => (
  <div className="w-8 h-8 rounded-full bg-orange-500 dark:bg-orange-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
    {initials}
  </div>
);

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm your Mangaldeep Academy AI assistant. Ask me anything about your tests, notes, or progress.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const userInitials = getUserInitials();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const { data } = await axios.post(
        API_URL,
        {
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
          withCredentials: true,
        }
      );

      const replyText = data?.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: replyText },
      ]);
    } catch (err) {
      console.error(
        "Chat request failed:",
        err.response?.status,
        err.response?.data || err.message
      );

      const fallbackText =
        err.response?.data?.error ||
        "Sorry, something went wrong reaching the assistant. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: fallbackText },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <img
          src={LOGO_SRC}
          alt="Mangaldeep Academy"
          className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-800"
        />

        <div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mangaldeep Academy
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && <AssistantAvatar />}

              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${
                    m.role === "user"
                      ? "bg-orange-500 dark:bg-orange-600 text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-sm"
                  }`}
              >
                {m.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.text
                )}
              </div>

              {m.role === "user" && <UserAvatar initials={userInitials} />}
            </motion.div>
          ))}
        </AnimatePresence>

        {isSending && (
          <div className="flex items-end gap-2 justify-start">
            <AssistantAvatar />
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 py-3"
      >
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your tests, notes, or progress..."
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center
                       bg-orange-500 dark:bg-orange-600 text-white
                       disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;