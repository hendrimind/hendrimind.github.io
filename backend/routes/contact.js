import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "..", "data", "contacts.json");

function readContacts() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

function writeContacts(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

/* ── POST /api/contact ── public, simpan subscriber/pesan ── */
router.post("/", (req, res) => {
  const { email, name, message } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email wajib diisi" });
  }

  // Validasi email sederhana
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format email tidak valid" });
  }

  const contacts = readContacts();

  // Cek duplikat email
  const existing = contacts.find((c) => c.email === email);
  if (existing && !message) {
    return res.status(409).json({ error: "Email sudah terdaftar" });
  }

  const newContact = {
    id: Date.now(),
    email,
    name: name || "",
    message: message || "",
    status: "unread",
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  writeContacts(contacts);

  res.status(201).json({
    message: "Pesan/subscripsi berhasil dikirim. Terima kasih!",
    data: newContact,
  });
});

/* ── GET /api/contact ── admin only, ambil semua ─────────── */
router.get("/", authenticate, (req, res) => {
  const contacts = readContacts();
  res.json({ total: contacts.length, data: contacts });
});

/* ── PUT /api/contact/:id ── admin, tandai sudah dibaca ──── */
router.put("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const contacts = readContacts();
  const idx = contacts.findIndex((c) => String(c.id) === String(id));

  if (idx === -1) {
    return res.status(404).json({ error: "Contact tidak ditemukan" });
  }

  contacts[idx].status = status || "read";
  writeContacts(contacts);

  res.json({ message: "Status diperbarui", data: contacts[idx] });
});

/* ── DELETE /api/contact/:id ── admin only ───────────────── */
router.delete("/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const contacts = readContacts();
  const filtered = contacts.filter((c) => String(c.id) !== String(id));

  if (filtered.length === contacts.length) {
    return res.status(404).json({ error: "Contact tidak ditemukan" });
  }

  writeContacts(filtered);
  res.json({ message: "Contact berhasil dihapus" });
});

export default router;
