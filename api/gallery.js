import db, { handleOptions, verifyToken, ok, created, badRequest, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  // ── GET: Public — ambil semua foto ─────────────
  if (req.method === "GET") {
    const baseUrl = process.env.BASE_URL || "";
    const withFullUrl = db.gallery.map((item) => ({
      ...item,
      image: item.image.startsWith("http")
        ? item.image
        : item.image.startsWith("/uploads")
        ? `${baseUrl}${item.image}`
        : item.image,
    }));
    return ok(res, { total: withFullUrl.length, data: withFullUrl });
  }

  // ── POST: Admin — tambah foto ──────────────────
  if (req.method === "POST") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    const { title, description, category, image } = req.body;

    if (!title || !category) {
      return badRequest(res, "Title dan category wajib diisi");
    }

    if (!image) {
      return badRequest(res, "URL gambar wajib diisi (Vercel tidak support file upload, gunakan URL)");
    }

    const newPhoto = {
      id: Date.now(),
      title,
      description: description || "",
      category,
      image,
      createdAt: new Date().toISOString(),
    };

    db.gallery.push(newPhoto);

    return created(res, {
      message: "Foto berhasil ditambahkan",
      data: newPhoto,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
