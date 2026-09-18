// models/note.model.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Note name
    pdfUrl: { type: String, required: true }, // Cloudinary/S3/local path
    cloudinaryId: { type: String }, // Cloudinary public_id, used to delete the file on note delete
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);