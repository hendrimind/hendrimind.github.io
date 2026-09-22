import db, { handleOptions, verifyToken, ok, created, badRequest, unauthorized } from "./_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  // ── POST: Public — simpan subscribe/pesan ──────
  if (req.method === "POST") {
    const { email, name, message } = req.body;

    if (!email) {
      return badRequest(res, "Email wajib diisi");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return badRequest(res, "Format email tidak valid");
    }

    // Cek duplikat
    const existing = db.contacts.find((c) => c.email === email);
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

    db.contacts.push(newContact);

    return created(res, {
      message: "Pesan/subscripsi berhasil dikirim. Terima kasih!",
      data: newContact,
    });
  }

  // ── GET: Admin only — ambil semua ──────────────
  if (req.method === "GET") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    return ok(res, { total: db.contacts.length, data: db.contacts });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
