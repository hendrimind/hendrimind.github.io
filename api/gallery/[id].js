import db, { handleOptions, verifyToken, ok, badRequest, notFound, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const { id } = req.query;

  // ── GET: Public — ambil 1 foto ─────────────────
  if (req.method === "GET") {
    const item = db.gallery.find((g) => String(g.id) === String(id));
    if (!item) {
      return notFound(res, "Foto tidak ditemukan");
    }
    return ok(res, { data: item });
  }

  // ── PUT: Admin — edit foto ──────────────────────
  if (req.method === "PUT") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    const idx = db.gallery.findIndex((g) => String(g.id) === String(id));
    if (idx === -1) {
      return notFound(res, "Foto tidak ditemukan");
    }

    const { title, description, category, image } = req.body;

    if (title) db.gallery[idx].title = title;
    if (description !== undefined) db.gallery[idx].description = description;
    if (category) db.gallery[idx].category = category;
    if (image) db.gallery[idx].image = image;

    return ok(res, { message: "Foto berhasil diperbarui", data: db.gallery[idx] });
  }

  // ── DELETE: Admin — hapus foto ─────────────────
  if (req.method === "DELETE") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    const idx = db.gallery.findIndex((g) => String(g.id) === String(id));
    if (idx === -1) {
      return notFound(res, "Foto tidak ditemukan");
    }

    db.gallery.splice(idx, 1);
    return ok(res, { message: "Foto berhasil dihapus" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
