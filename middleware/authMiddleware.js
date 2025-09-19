// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

  const token = authHeader.split(" ")[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, role, userId
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
