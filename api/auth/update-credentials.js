import db, { handleOptions, verifyToken, signToken, ok, badRequest, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  // ── Hanya admin yang boleh akses ──────────────
  const user = verifyToken(req);
  if (!user) {
    return unauthorized(res, "Token tidak ditemukan atau kadaluarsa");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { currentPassword, newUsername, newPassword } = req.body;

  // ── Validasi ──────────────────────────────────
  if (!currentPassword) {
    return badRequest(res, "Password lama wajib diisi untuk konfirmasi");
  }

  // Cek password lama
  if (currentPassword !== db.admin.password) {
    return unauthorized(res, "Password lama salah");
  }

  if (!newUsername && !newPassword) {
    return badRequest(res, "Isi username baru atau password baru");
  }

  // ── Update credentials ────────────────────────
  if (newUsername) {
    if (newUsername.length < 3) {
      return badRequest(res, "Username minimal 3 karakter");
    }
    db.admin.username = newUsername;
  }

  if (newPassword) {
    if (newPassword.length < 6) {
      return badRequest(res, "Password baru minimal 6 karakter");
    }
    db.admin.password = newPassword;
  }

  // ── Generate token baru ───────────────────────
  const token = signToken({
    username: db.admin.username,
    role: "admin",
  });

  return ok(res, {
    message: "Credentials berhasil diperbarui! Silakan login ulang dengan credentials baru.",
    token,
    user: { username: db.admin.username, role: "admin" },
  });
}
