import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },

    duration: {
      type: Number,
      default: 30,
      min: [1, "Duration must be at least 1 minute"],
    },

    questions: [
      {
        question: String,
        options: {
          A: String,
          B: String,
          C: String,
          D: String,
        },
        correctAnswer: String,
        image: {
          type: String, // Cloudinary URL
          default: null, // optional
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);