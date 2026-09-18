import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test", // link to Test
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: {
  type: [String], // one entry per question, e.g. ["A", "C", null, "B"]
  default: [],
},
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
