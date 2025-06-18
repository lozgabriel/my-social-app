// utils/auth.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    console.error("Token inválido ou expirado:", e);
    return null;
  }
}
