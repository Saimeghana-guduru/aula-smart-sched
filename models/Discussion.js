const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  senderRole: { type: String, enum: ["student","faculty","admin","hod"], required: true },
  senderId: { type: String, required: true },
  receiverRole: { type: String, enum: ["student","faculty","admin","hod"] }, // optional
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Discussion", discussionSchema);
