import express from "express";
import { getAllTests, getTestForStudent, getTestReview, submitTestAnswer } from "../controllers/test_controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// GET /api/v1/student/tests → list of all available tests for students
router.get("/", isAuthenticated, getAllTests);

router.get("/:id", isAuthenticated, getTestForStudent);
 
// POST /api/v1/student/tests/:id/submit → submit answers, get scored result back
router.post("/:id/submit", isAuthenticated, submitTestAnswer);

router.get("/review/:resultId", getTestReview);


export default router;

