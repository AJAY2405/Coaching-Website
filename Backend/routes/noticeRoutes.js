import express from "express";
import { createNotice, deleteNotice, getNotices, updateNotice } from "../controllers/noticeController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.get("/", getNotices);
router.post("/create", isAuthenticated,createNotice);
router.get("/all", isAuthenticated, getNotices);
router.put("/:id", isAuthenticated, updateNotice);
router.delete("/:id", isAuthenticated, deleteNotice);

export default router;  // instead of module.exports
