const express = require("express");
const Discussion = require("../models/Discussion");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Send discussion / feedback
router.post("/", auth, async (req, res) => {
  const { message, receiverRole } = req.body;
  if (!message) return res.status(400).json({ msg: "Message required" });

  try {
    const discussion = new Discussion({
      senderRole: req.user.role,
      senderId: req.user.userId,
      receiverRole,
      message,
    });
    await discussion.save();
    res.status(201).json({ msg: "Message sent", discussion });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get all discussions for current user (optional: filter by role)
router.get("/", auth, async (req, res) => {
  try {
    const discussions = await Discussion.find({
      $or: [
        { senderRole: req.user.role },
        { receiverRole: req.user.role }
      ]
    }).sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
