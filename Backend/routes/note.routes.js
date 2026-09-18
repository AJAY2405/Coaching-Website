import express from "express";
import { uploadNote, getNotes, deleteNote } from "../controllers/note.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { Note } from "../models/note.model.js"; // ⬅️ named import


const router = express.Router();

// Admin uploads a PDF
router.post("/upload", isAuthenticated, singleUpload, uploadNote);

// Users fetch notes
router.get("/", isAuthenticated, getNotes);

// Serve a single note's PDF (Cloudinary)
router.get("/:id/pdf", isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || !note.pdfUrl) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Redirect to Cloudinary PDF
    return res.redirect(note.pdfUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", isAuthenticated, deleteNote);



export default router;
