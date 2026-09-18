import express from "express";
import Result from "../models/Result.js";
import Test from "../models/test_model.js";
import {User} from "../models/user_model.js"
// import User from "../models/user_model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Get all tests (just test titles & descriptions)
router.get("/tests", async (req, res) => {
  try {
    const tests = await Test.find().select("title description totalMarks");
    res.json({ success: true, tests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching tests" });
  }
});

// Get all student submissions for one test
router.get("/tests/:id", async (req, res) => {
  try {
    const results = await Result.find({ test: req.params.id })
      .populate("test", "title description totalMarks").sort({percentage:-1}) // only populate test, not student
      .sort({ createdAt: -1 });
      // console.log(results)

    // Format data (no need to populate student since you store name/email already)
    const formattedResults = results.map(r => ({
      _id: r._id,
      studentName: r.studentName,
      studentEmail: r.studentEmail,
      score: r.score,
      percentage: r.percentage,
      submittedAt: r.submittedAt,
    }));

    res.json({ success: true, results: formattedResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
});


// New: a logged-in student's own progress across every test they've taken
router.get("/student/progress", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const normalizedEmail = (user.email || "").trim();
    const results = await Result.find({
      studentEmail: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    })
      .populate("test", "title description")
      .sort({ submittedAt: 1 });
 
    const formatted = results.map((r) => ({
      _id: r._id,
      testId: r.test?._id || null,
      testTitle: r.test?.title || "Untitled Test",
      score: r.score,
      percentage: r.percentage,
      submittedAt: r.submittedAt,
    }));
 
    const totalTests = formatted.length;
    const averagePercentage =
      totalTests > 0
        ? formatted.reduce((sum, r) => sum + r.percentage, 0) / totalTests
        : 0;
    const bestPercentage =
      totalTests > 0 ? Math.max(...formatted.map((r) => r.percentage)) : 0;
 
    res.json({
      success: true,
      results: formatted,
      summary: {
        totalTests,
        averagePercentage,
        bestPercentage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching progress" });
  }
});


router.get("/daily-attempts", isAuthenticated, async (req, res) => {
  try {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    const dailyAttempts = await Result.aggregate([
      {
        $match: {
          submittedAt: { $gte: THIRTY_DAYS_AGO },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" },
            },
            studentEmail: "$studentEmail",
          },
        },
      },
      {
        // After the first $group, each doc is one (date, student) pair.
        // Now group by date only and count how many such pairs exist that day
        // — i.e. how many distinct students took a test that day.
        $group: {
          _id: "$_id.date",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({ success: true, data: dailyAttempts });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching daily attempts" });
  }
});

export default router;
