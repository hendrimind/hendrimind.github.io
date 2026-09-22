import db, { handleOptions, verifyToken, ok, notFound, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const { id } = req.query;

  // ── PUT: Admin — tandai sudah dibaca ───────────
  if (req.method === "PUT") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    const idx = db.contacts.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) {
      return notFound(res, "Contact tidak ditemukan");
    }

    db.contacts[idx].status = req.body.status || "read";
    return ok(res, { message: "Status diperbarui", data: db.contacts[idx] });
  }

  // ── DELETE: Admin — hapus contact ──────────────
  if (req.method === "DELETE") {
    const user = verifyToken(req);
    if (!user) {
      return unauthorized(res, "Token tidak ditemukan");
    }

    const idx = db.contacts.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) {
      return notFound(res, "Contact tidak ditemukan");
    }

    db.contacts.splice(idx, 1);
    return ok(res, { message: "Contact berhasil dihapus" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
