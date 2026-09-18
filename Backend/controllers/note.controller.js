import { Note } from "../models/note.model.js";
import cloudinary from "../utils/cloudinary.js";
 
// Upload Note (PDF)
export const uploadNote = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
 
    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ success: false, message: "Only PDF files are allowed" });
    }
 
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "notes",
            use_filename: true,
            unique_filename: true,
            overwrite: false,      
            format: "pdf",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(file.buffer);
      });
    };
 
    const result = await uploadToCloudinary();
 
    const note = await Note.create({
      title: req.body.title,
      pdfUrl: result.secure_url,
      cloudinaryId: result.public_id,
      uploadedBy: req.id,
    });
 
    res.status(201).json({ success: true, note });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// Get Notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 }).lean();
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
 
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
 
    if (note.uploadedBy.toString() !== req.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this note" });
    }
 
    if (note.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(note.cloudinaryId, {
          resource_type: "raw",
        });
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr.message);
      }
    }
 
    await Note.findByIdAndDelete(id);
 
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
