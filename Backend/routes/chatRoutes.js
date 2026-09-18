
// backend/routes/chatRoutes.js

import express from "express";
import { handleChat, healthCheck } from "../controllers/chatController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.post("/chat",isAuthenticated ,handleChat);
router.get("/health", healthCheck);

export default router;

