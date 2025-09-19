const express = require("express");
const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create notification (admin/faculty/hod)
router.post("/", auth, async (req, res) => {
  const { title, message, receiverRoles } = req.body;
  if (!title || !message || !receiverRoles) return res.status(400).json({ msg: "Missing fields" });

  try {
    const notification = new Notification({
      title,
      message,
      senderRole: req.user.role,
      receiverRoles,
    });
    await notification.save();
    res.status(201).json({ msg: "Notification created", notification });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get notifications for current user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverRoles: req.user.role }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
