import { setCors, handleOptions, ok } from "./_lib.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  return ok(res, {
    status: "OK",
    message: "Hendrimind API is running on Vercel",
    timestamp: new Date().toISOString(),
  });
}
