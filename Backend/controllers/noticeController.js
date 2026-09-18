import Notice from "../models/Notice.js";
import { User } from "../models/user_model.js";
// import User from "../models/user_model.js";

export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      title: req.body.title,
      message: req.body.message,
      createdBy: req.id || null,
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notice" });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }).lean();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // any teacher (not just the original creator) may edit a notice
    const requester = await User.findById(req.id).lean();
    if (!requester || requester.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can edit notices" });
    }

    notice.title = req.body.title ?? notice.title;
    notice.message = req.body.message ?? notice.message;
    await notice.save();

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update notice" });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // any teacher (not just the original creator) may delete a notice
    const requester = await User.findById(req.id);
    if (!requester || requester.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can delete notices" });
    }

    await Notice.findByIdAndDelete(id);
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

