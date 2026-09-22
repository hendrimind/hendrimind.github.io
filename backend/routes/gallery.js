import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "..", "data", "gallery.json");
const uploadsDir = path.join(__dirname, "..", "uploads");

function readGallery() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

function writeGallery(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

/* ── Konfigurasi Multer (upload gambar) ──────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error("Hanya file gambar (jpg, png, webp, gif)"));
  },
});

/* ── GET /api/gallery ── public, ambil semua foto ─────────── */
router.get("/", (req, res) => {
  const gallery = readGallery();
  const baseUrl = process.env.BASE_URL || "";
  const withFullUrl = gallery.map((item) => ({
    ...item,
    image: item.image.startsWith("http")
      ? item.image
      : item.image.startsWith("/uploads")
      ? `${baseUrl}${item.image}`
      : item.image,
  }));
  res.json({ total: withFullUrl.length, data: withFullUrl });
});

/* ── GET /api/gallery/:id ── public, ambil 1 foto ────────── */
router.get("/:id", (req, res) => {
  const gallery = readGallery();
  const item = gallery.find((g) => String(g.id) === String(req.params.id));
  if (!item) return res.status(404).json({ error: "Foto tidak ditemukan" });
  res.json({ data: item });
});

/* ── POST /api/gallery ── admin, tambah foto (dengan upload) ─ */
router.post("/", authenticate, upload.single("image"), (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: "Title dan category wajib diisi" });
  }
  if (!req.file && !req.body.image) {
    return res.status(400).json({ error: "Gambar wajib diupload" });
  }

  const gallery = readGallery();
  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  const newPhoto = {
    id: Date.now(),
    title,
    description: description || "",
    category,
    image: imagePath,
    createdAt: new Date().toISOString(),
  };

  gallery.push(newPhoto);
  writeGallery(gallery);

  res.status(201).json({ message: "Foto berhasil ditambahkan", data: newPhoto });
});

/* ── PUT /api/gallery/:id ── admin, edit foto ─────────────── */
router.put("/:id", authenticate, upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  const gallery = readGallery();
  const idx = gallery.findIndex((g) => String(g.id) === String(id));

  if (idx === -1) {
    return res.status(404).json({ error: "Foto tidak ditemukan" });
  }

  if (title) gallery[idx].title = title;
  if (description !== undefined) gallery[idx].description = description;
  if (category) gallery[idx].category = category;
  if (req.file) gallery[idx].image = `/uploads/${req.file.filename}`;

  writeGallery(gallery);

  res.json({ message: "Foto berhasil diperbarui", data: gallery[idx] });
});

/* ── DELETE /api/gallery/:id ── admin, hapus foto ─────────── */
router.delete("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const gallery = readGallery();
  const item = gallery.find((g) => String(g.id) === String(id));

  if (!item) {
    return res.status(404).json({ error: "Foto tidak ditemukan" });
  }

  // Hapus file gambar dari uploads jika ada
  if (item.image && item.image.startsWith("/uploads/")) {
    const filePath = path.join(uploadsDir, path.basename(item.image));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const filtered = gallery.filter((g) => String(g.id) !== String(id));
  writeGallery(filtered);

  res.json({ message: "Foto berhasil dihapus" });
});

export default router;
