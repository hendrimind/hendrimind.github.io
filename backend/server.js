import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import galleryRoutes from "./routes/gallery.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/* ── Database init (JSON files) ───────────────────────────── */
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const defaultData = {
  "contacts.json": [],
  "gallery.json": [
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
};

for (const [file, content] of Object.entries(defaultData)) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

/* ── Middleware ───────────────────────────────────────────── */
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Static Files ─────────────────────────────────────────── */
// Serve frontend (parent directory)
app.use(express.static(path.join(__dirname, "..")));
// Serve uploaded images
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

/* ── API Routes ───────────────────────────────────────────── */
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);

/* ── Health Check ─────────────────────────────────────────── */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Hendrimind API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ── Admin Dashboard ──────────────────────────────────────── */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

/* ── 404 Handler ──────────────────────────────────────────── */
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

/* ── Start Server ─────────────────────────────────────────── */
app.listen(PORT, "0.0.0.0", () => {
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  Hendrimind Backend API                      │");
  console.log("│─────────────────────────────────────────────│");
  console.log(`│  Server:  http://localhost:${PORT}              │`);
  console.log(`│  Admin:   http://localhost:${PORT}/admin          │`);
  console.log(`│  API:     http://localhost:${PORT}/api            │`);
  console.log("└─────────────────────────────────────────────┘");
});
