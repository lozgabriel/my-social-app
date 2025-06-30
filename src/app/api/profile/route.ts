import path from "path";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  // Pega o token JWT do cookie
  const cookie = request.headers.get("cookie");
  let token: string | null = null;
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  const userId =
    typeof decoded === "object" && decoded !== null && "id" in decoded
      ? decoded.id
      : null;

  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      bio: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  // 1. Pega o token do cookie, valida como no GET
  const cookie = request.headers.get("cookie");
  let token: string | null = null;
  if (cookie) {
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const decoded = verifyToken(token);
  const userId =
    typeof decoded === "object" && decoded !== null && "id" in decoded
      ? decoded.id
      : null;
  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // 2. Recebe o formData (suporta upload de avatar e campos de texto)
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const avatar = formData.get("avatar") as File | null;

  let imageUrl: string | undefined = undefined;
  if (avatar) {
    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${userId}-${Date.now()}_${avatar.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  // 3. Atualiza o perfil no banco
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      bio,
      ...(imageUrl && { image: imageUrl }),
    },
    select: { name: true, email: true, image: true, bio: true },
  });

  return NextResponse.json(updated);
}