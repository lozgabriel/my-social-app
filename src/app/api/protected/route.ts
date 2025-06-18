// app/api/protected/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // ...lógica protegida aqui...
  return NextResponse.json({ message: "Acesso permitido!", user: payload });
}
