// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
}));

app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/discussions", require("./routes/discussionRoutes"));


// test root
app.get("/", (req, res) => res.send("SmartClass Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
