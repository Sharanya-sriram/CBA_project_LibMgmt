// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // your MySQL pool/connection
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, username, password, age, college, email } = req.body;

    // check if user already exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username or Email already taken" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert new user
    const [result] = await pool.query(
      "INSERT INTO users (name, username, password, age, college, email) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, hashedPassword, age, college, email]
    );

    // generate JWT
    const token = jwt.sign(
      { id: result.insertId, username, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // send JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET current logged-in user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query("SELECT id, username, role, name, email FROM users WHERE id = ?", [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
