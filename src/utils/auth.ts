import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string): JwtPayload | string | null {
  if (!SECRET) {
    console.error("JWT_SECRET não definido nas variáveis de ambiente.");
    return null;
  }
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    console.error("Erro ao verificar token:", e);
    return null;
  }
}