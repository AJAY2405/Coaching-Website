// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { generateAiTest, getAiTests, getAiTestById, deleteAiTest, submitAiTest, getAllAiTestsForStudents, getAiTestForAttempt } from "../controllers/aitest.controller.js";

// const router = express.Router();

// router.post("/generate", isAuthenticated, generateAiTest);
// router.get("/", isAuthenticated, getAiTests);
// router.get("/:id", isAuthenticated, getAiTestById);
// router.delete("/:id", isAuthenticated, deleteAiTest);
// router.post("/:id/submit", isAuthenticated, submitAiTest);

// router.get("/student/all", isAuthenticated, getAllAiTestsForStudents);
// router.get("/:id/attempt", isAuthenticated, getAiTestForAttempt);




// export default router;


import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  generateAiTest,
  getAiTests,
  getAiTestById,
  deleteAiTest,
  submitAiTest,
  getAllAiTestsForStudents,
  getAiTestForAttempt,
  getMyAiTestResults,
  getAiTestResultsForTeacher,
  getAiTestResultById,
  getAiTestResultsSummaryForTeacher,
  getAiTestResultsByTest,
  updateAiTest,
} from "../controllers/aitest.controller.js";

const router = express.Router();

// ⚠️ specific routes MUST come before "/:id"
router.get("/student/all", isAuthenticated, getAllAiTestsForStudents);
router.get("/results/student", isAuthenticated, getMyAiTestResults);
router.get("/results/teacher", isAuthenticated, getAiTestResultsForTeacher);
router.get("/results/:resultId", isAuthenticated, getAiTestResultById); 


router.get("/results/teacher/summary", isAuthenticated, getAiTestResultsSummaryForTeacher);
router.get("/results/teacher/test/:testId", isAuthenticated, getAiTestResultsByTest);
router.put("/:id", isAuthenticated, updateAiTest); 
router.post("/generate", isAuthenticated, generateAiTest);
router.get("/", isAuthenticated, getAiTests);
router.get("/:id/attempt", isAuthenticated, getAiTestForAttempt);
router.get("/:id", isAuthenticated, getAiTestById);
router.delete("/:id", isAuthenticated, deleteAiTest);
router.post("/:id/submit", isAuthenticated, submitAiTest);

export default router;