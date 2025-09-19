// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const ALLOWED_ROLES = ["admin", "student", "faculty", "hod"];

// Signup
router.post("/signup", async (req, res) => {
  const { name, userId, email, university, password, role } = req.body;

  if (!name || !userId || !email || !university || !password || !role) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  try {
    const existing = await User.findOne({ $or: [{ email }, { userId }] });
    if (existing) {
      return res.status(400).json({ msg: "User with same email or ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      userId,
      email,
      university,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // you could also allow login by userId if desired
  if (!email || !password) return res.status(400).json({ msg: "Provide email and password" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      msg: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        userId: user.userId,
        role: user.role,
        university: user.university,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
