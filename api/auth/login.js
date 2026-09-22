import { setCors, handleOptions, signToken, ok, badRequest, unauthorized } from "../../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res, "Username dan password wajib diisi");
  }

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== validUser || password !== validPass) {
    return unauthorized(res, "Username atau password salah");
  }

  const token = signToken({ username, role: "admin" });

  return ok(res, {
    message: "Login berhasil",
    token,
    user: { username, role: "admin" },
  });
}
