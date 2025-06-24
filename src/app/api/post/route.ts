import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Extrair o token JWT do cookie
  const cookie = request.headers.get("cookie");
  let token: string | null = null;
  if (cookie) {
    // Supondo que seu cookie se chame 'token' ou 'jwt'
    const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    token = match ? decodeURIComponent(match[1]) : null;
  }

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  // Ajuste aqui conforme o payload do seu token!
  const userId =
    typeof decoded === "object" && decoded !== null && "id" in decoded
      ? decoded.id
      : null;

  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // resto do código...
  const formData = await request.formData();
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  if (!content && !image) {
    return NextResponse.json({ error: "Conteúdo vazio" }, { status: 400 });
  }

  let imageUrl = null;
  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuidv4()}_${image.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(filePath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const post = await prisma.post.create({
    data: {
      content,
      imageUrl,
      authorId: userId,
    },
  });

  return NextResponse.json(post);
}
