import { ChatGroq } from "@langchain/groq";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

import {
  getMyAiTestResults,
  getMyTestResults,
  getMyProgressSummary,
  getMyProfile,
} from "../tools/studentTools.js";

const MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `
You are the official AI assistant for Mangaldeep Academy.

You can help ONLY with:

1. Mangaldeep Academy platform-related questions
2. Academic and study-related questions

You are NOT a general-purpose chatbot.

Mangaldeep Academy supports:

STUDENT FEATURES:
- Registration
- Login
- Student dashboard
- Viewing tests
- Attempting tests
- Viewing results
- Tracking progress
- Notes and study materials
- Notices
- AI-generated tests
- AI chat assistant

TEACHER FEATURES:
- Teacher login
- Teacher dashboard
- Creating tests
- Managing tests
- Viewing student results
- Uploading notes
- Managing study materials
- Posting notices
- AI-generated tests

ACADEMIC TOPICS:
- Mathematics
- Science
- Physics
- Chemistry
- Biology
- English
- Hindi
- Computer Science
- Programming
- Java
- JavaScript
- Python
- C/C++
- DSA
- DBMS
- Operating Systems
- Computer Networks
- AI
- Machine Learning
- Electronics
- Digital Electronics
- Computer Architecture
- Exam preparation
- Homework
- Revision

IMPORTANT:

Do not invent Mangaldeep Academy features, APIs, pages,
buttons, permissions, database fields, URLs, scoring rules,
or personal student information.

If you don't know something about the platform, say:

"I don't have enough information about that Mangaldeep Academy feature."

TOOLS AND PERSONAL DATA:

If tools are available to you in this conversation, they let you look up
the CURRENTLY LOGGED-IN student's own marks, test results, progress, and
profile info. Only use them when the student asks about their own
results/progress/profile. Always call the relevant tool instead of
guessing or inventing numbers. Never claim to know a score, percentage,
or test title unless it came from a tool result.

If no tools are available in this conversation (the user is not logged
in), and they ask about marks, results, progress, or personal account
info, say:

"You'll need to be logged in for me to look up your results/progress."

You never have access to any OTHER student's data, under any
circumstances, even if asked directly.

For unrelated questions, respond:

"Sorry, I can only help with Mangaldeep Academy and study-related
questions such as Maths, Science, English, Computer Science, exams,
tests, notes, results, and other academic topics."

Be concise, friendly, and student-friendly.
Use simple explanations and step-by-step answers when required.
`;

// LangChain Groq Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: MODEL,
  temperature: 0.4,
  maxTokens: 1000,
});

// Convert frontend history into LangChain messages
const buildMessages = (message, history = []) => {
  const messages = [new SystemMessage(SYSTEM_PROMPT)];

  if (Array.isArray(history)) {
    history
      .filter(
        (m) =>
          m &&
          typeof m.text === "string" &&
          (m.role === "user" || m.role === "assistant")
      )
      .slice(-10)
      .forEach((m) => {
        if (!m.text.trim()) return;

        if (m.role === "user") {
          messages.push(new HumanMessage(m.text.trim()));
        } else {
          messages.push(new AIMessage(m.text.trim()));
        }
      });
  }

  messages.push(new HumanMessage(message.trim()));

  return messages;
};


const buildStudentTools = (studentId) => {
  if (!studentId) return [];

  return [
    tool(
      async () => JSON.stringify(await getMyAiTestResults(studentId)),
      {
        name: "get_my_ai_test_results",
        description:
          "Get the logged-in student's results for AI-generated tests: subject, topic, difficulty, score, total, and percentage for each attempt.",
        schema: z.object({}),
      }
    ),
    tool(
      async () => JSON.stringify(await getMyTestResults(studentId)),
      {
        name: "get_my_test_results",
        description:
          "Get the logged-in student's results for teacher-created (normal) tests: test title, score, and percentage for each attempt.",
        schema: z.object({}),
      }
    ),
    tool(
      async () => JSON.stringify(await getMyProgressSummary(studentId)),
      {
        name: "get_my_progress_summary",
        description:
          "Get a combined progress summary for the logged-in student across AI tests and normal tests: total tests taken, average percentage, best and worst results.",
        schema: z.object({}),
      }
    ),
    tool(
      async () => JSON.stringify(await getMyProfile(studentId)),
      {
        name: "get_my_profile",
        description:
          "Get the logged-in student's basic profile info: full name, email, role, description, member since date. Never includes the password.",
        schema: z.object({}),
      }
    ),
  ];
};

const MAX_TOOL_ROUNDS = 3;

// POST /api/chat
const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    // Set by isAuthenticated middleware when a valid token cookie is present.
    // Undefined for guests -> buildStudentTools returns [] -> no DB access.
    const studentId = req.id;

    // Validation
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "message is required",
      });
    }

    // Message size limit
    if (message.length > 5000) {
      return res.status(400).json({
        error: "Message is too long. Please keep it under 5000 characters.",
      });
    }

    // Build LangChain messages
    const messages = buildMessages(message, history);

    // Build tools scoped to this request's authenticated student (if any)
    const tools = buildStudentTools(studentId);
    const toolMap = Object.fromEntries(tools.map((t) => [t.name, t]));
    const modelForRequest = tools.length ? model.bindTools(tools) : model;

    // Call LangChain + Groq
    let response = await modelForRequest.invoke(messages);

    // Tool-calling loop: execute any tool_calls the model requests, feed the
    // results back, and let the model respond again. Capped to avoid loops.
    let rounds = 0;
    while (response.tool_calls?.length && rounds < MAX_TOOL_ROUNDS) {
      messages.push(response); // AIMessage carrying the tool_calls

      const toolMessages = await Promise.all(
        response.tool_calls.map(async (call) => {
          const matchedTool = toolMap[call.name];
          let content;

          try {
            content = matchedTool
              ? await matchedTool.invoke(call.args)
              : `Tool "${call.name}" is not available.`;
          } catch (toolErr) {
            console.error("Tool execution error:", call.name, toolErr);
            content = `Error running tool "${call.name}".`;
          }

          return new ToolMessage({
            content: typeof content === "string" ? content : JSON.stringify(content),
            tool_call_id: call.id,
          });
        })
      );

      messages.push(...toolMessages);

      response = await modelForRequest.invoke(messages);
      rounds += 1;
    }

    // Extract response
    const replyText =
      typeof response.content === "string"
        ? response.content.trim()
        : response.content
            ?.map((item) => item.text || "")
            .join("")
            .trim();

    return res.status(200).json({
      reply: replyText || "Sorry, I couldn't generate a response.",
    });
  } catch (err) {
    console.error("LangChain Groq error:", {
      status: err?.status,
      message: err?.message,
      name: err?.name,
    });

    // Authentication error
    if (err?.status === 401) {
      return res.status(500).json({
        error: "AI service authentication failed.",
      });
    }

    // Rate limit
    if (err?.status === 429) {
      return res.status(429).json({
        error: "AI service is temporarily busy. Please try again later.",
      });
    }

    return res.status(500).json({
      error: "Something went wrong reaching the assistant.",
    });
  }
};

// GET /api/health
const healthCheck = (req, res) => {
  return res.status(200).json({
    ok: true,
    service: "Mangaldeep Academy AI Assistant",
    model: MODEL,
  });
};

export { handleChat, healthCheck };