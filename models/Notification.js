const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  senderRole: { type: String, enum: ["student","faculty","admin","hod"], required: true },
  receiverRoles: [{ type: String, enum: ["student","faculty","admin","hod"], required: true }],
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
