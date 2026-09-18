import express from "express";
import {
  createTest,
  deleteTest,
  getAllTests,
  getTestById,
  getTestsByTeacher,
  getTestSubmissions,
  parseTestPdf,
  updateTest,
} from "../controllers/test_controller.js";
import { upload } from "../middlewares/upload.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// POST with optional pdf + images
router.post("/", upload, createTest);

router.get("/", getAllTests);
router.get("/teacher/:teacherId", getTestsByTeacher);
router.get("/:id/submissions", getTestSubmissions);

router.get("/:id", getTestById);
router.put("/:id", upload, updateTest);
router.delete("/:id", deleteTest);

router.post("/parse-pdf", singleUpload, parseTestPdf);

export default router;