import { handleOptions, verifyToken, ok, unauthorized } from "../_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  const user = verifyToken(req);
  if (!user) {
    return unauthorized(res, "Token tidak valid atau kadaluarsa");
  }

  return ok(res, { valid: true, user });
}
