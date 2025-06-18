// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ajuste o path conforme seu projeto
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, senha } = body;

  if (!name || !email || !senha) {
    return NextResponse.json(
      { error: "Preencha todos os campos" },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        senha: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}
