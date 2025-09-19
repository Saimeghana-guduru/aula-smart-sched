
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true }, // college/staff/student id
    email: { type: String, required: true, unique: true },
    university: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "student", "faculty", "hod"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
