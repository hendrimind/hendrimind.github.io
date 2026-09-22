/**
 * Shared utilities for Vercel serverless functions
 * In-memory data store (resets on cold start)
 * For production: upgrade to Vercel KV or Upstash Redis
 */

// ── In-Memory Database ───────────────────────────
const db = {
  contacts: [],
  gallery: [
    {
      id: 1,
      title: "Story in Black and White",
      description:
        "Life is about white or black, good or bad, trying or giving up, and there is no in between.",
      category: "street",
      image: "/assets/img/bg-masthead.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Cheerful Laugh",
      description:
        "Being able to laugh when you are hurting yourself is one proof of how strong you can live this life.",
      category: "portrait",
      image: "/assets/img/demo-image-01.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Two Ladies in Sunset",
      description: "The sun has set. The moon appears. And life goes on.",
      category: "nature",
      image: "/assets/img/demo-image-02.jpg",
      createdAt: new Date().toISOString(),
    },
  ],
  // Admin credentials — di-init dari env, bisa diubah runtime
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
};

// ── JWT Helper ────────────────────────────────────
import jwt from "jsonwebtoken";

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "24h",
  });
}

export function verifyToken(req) {
  const header = req.headers?.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(header.split(" ")[1], process.env.JWT_SECRET || "fallback_secret");
  } catch {
    return null;
  }
}

// ── Response Helpers ──────────────────────────────
export function ok(res, data) {
  return res.status(200).json(data);
}

export function created(res, data) {
  return res.status(201).json(data);
}

export function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

export function unauthorized(res, msg = "Unauthorized") {
  return res.status(401).json({ error: msg });
}

export function notFound(res, msg = "Not found") {
  return res.status(404).json({ error: msg });
}

// ── CORS Headers ─────────────────────────────────
export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export function handleOptions(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res);
    return true;
  }
  setCors(res);
  return false;
}

export default db;
