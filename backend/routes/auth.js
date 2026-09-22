import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

/* ── POST /api/auth/login ─────────────────────────────────── */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username dan password wajib diisi" });
  }

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: "Username atau password salah" });
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login berhasil",
    token,
    user: { username, role: "admin" },
  });
});

/* ── GET /api/auth/verify ────────────────────────────────── */
import { authenticate } from "../middleware/auth.js";
router.get("/verify", authenticate, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;
