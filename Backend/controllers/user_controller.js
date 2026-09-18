import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";
// ------------------------- REGISTER ------------------------
export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      // role,
      profile: {},
    });
    return res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
// ------------------------- LOGIN ------------------------
export const login = async (req, res) => {
  try {
    // console.log("Login attempt", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email }).lean();
    // console.log("User found:", user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }
    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });
    }
    // Check role
    // if (role !== user.role) {
    //   return res.status(400).json({ message: "Account doesn't exist with this role", success: false });
    // }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Safe user data
    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    // Send cookie + user data
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // because you're on https (Vercel + Render)
        sameSite: "none", // important for cross-site cookies
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${safeUser.fullname}`,
        user: safeUser, // send user data
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ------------------------- LOGOUT ------------------------
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ------------------------- UPDATE PROFILE ------------------------
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, bio, skills } = req.body;
    const userId = req.id;

    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (bio) user.profile.bio = bio;
    if (skills) {
      user.profile.skills = skills.split(",").map((skill) => skill.trim());
    }

    await user.save();

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: safeUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ------------------------- GET CURRENT USER ------------------------
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password").lean();
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------------- UPDATE DESCRIPTION ------------------------
export const updateDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.id; // this comes from authMiddleware after verifying JWT

    if (!description) {
      return res
        .status(400)
        .json({ message: "Description is required", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.description = description;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Description updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        description: user.description,
      },
    });
  } catch (error) {
    console.error("Update Description Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); // add .select("-password") to be safe
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};