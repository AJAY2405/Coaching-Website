import AiTestResult from "../models/aitestResult.model.js";
import Result from "../models/Result.js";
import { User } from "../models/user_model.js";

/**
 * Get all AI-generated test results for the logged-in student.
 */
export const getMyAiTestResults = async (studentId) => {
  const results = await AiTestResult.find({ student: studentId })
    .populate("test", "title subject topic difficulty totalMarks")
    .sort({ createdAt: -1 })
    .lean();

  return results.map((r) => ({
    testTitle: r.test?.title || "Unknown Test",
    subject: r.test?.subject || "Unknown",
    topic: r.test?.topic || "Unknown",
    difficulty: r.test?.difficulty || "Unknown",
    score: r.score,
    total: r.total,
    percentage: r.percentage,
    date: r.createdAt,
  }));
};

/**
 * Get all teacher-created ("normal") test results for the logged-in student.
 * Result is linked by studentEmail (not ObjectId), so we resolve the
 * student's email from the User model first.
 */
export const getMyTestResults = async (studentId) => {
  const user = await User.findById(studentId).select("email").lean();
  if (!user) return [];

  const results = await Result.find({ studentEmail: user.email })
    .populate("test", "title")
    .sort({ createdAt: -1 })
    .lean();

  return results.map((r) => ({
    testTitle: r.test?.title || "Unknown Test",
    score: r.score,
    percentage: r.percentage,
    submittedAt: r.submittedAt,
  }));
};

/**
 * Combined progress summary across both AI tests and normal tests.
 */
export const getMyProgressSummary = async (studentId) => {
  const [aiResults, normalResults] = await Promise.all([
    getMyAiTestResults(studentId),
    getMyTestResults(studentId),
  ]);

  const all = [
    ...aiResults.map((r) => ({ ...r, type: "AI Test" })),
    ...normalResults.map((r) => ({ ...r, type: "Normal Test" })),
  ];

  if (all.length === 0) {
    return {
      totalTestsTaken: 0,
      aiTestsTaken: 0,
      normalTestsTaken: 0,
      averagePercentage: 0,
      message: "No tests attempted yet.",
    };
  }

  const averagePercentage =
    all.reduce((sum, r) => sum + (r.percentage || 0), 0) / all.length;

  const best = all.reduce((a, b) => (b.percentage > a.percentage ? b : a));
  const worst = all.reduce((a, b) => (b.percentage < a.percentage ? b : a));

  return {
    totalTestsTaken: all.length,
    aiTestsTaken: aiResults.length,
    normalTestsTaken: normalResults.length,
    averagePercentage: Number(averagePercentage.toFixed(2)),
    bestResult: {
      testTitle: best.testTitle,
      percentage: best.percentage,
      type: best.type,
    },
    worstResult: {
      testTitle: worst.testTitle,
      percentage: worst.percentage,
      type: worst.type,
    },
  };
};

/**
 * Basic profile info for the logged-in student. Never returns the password.
 */
export const getMyProfile = async (studentId) => {
  const user = await User.findById(studentId)
    .select("fullname email role description createdAt")
    .lean();

  if (!user) return null;

  return {
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    description: user.description,
    memberSince: user.createdAt,
  };
};




// question for the test the agents :-

// What are my AI test results?
// How did I do on my normal tests?
// What's my overall progress?
// What's my profile info?