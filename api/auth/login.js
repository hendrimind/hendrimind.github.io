import db, { setCors, handleOptions, signToken, ok, badRequest, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res, "Username dan password wajib diisi");
  }

  // Validasi dari in-memory DB (bisa diubah runtime via /api/auth/update-credentials)
  if (username !== db.admin.username || password !== db.admin.password) {
    return unauthorized(res, "Username atau password salah");
  }

  const token = signToken({ username, role: "admin" });

  return ok(res, {
    message: "Login berhasil",
    token,
    user: { username, role: "admin" },
  });
}
