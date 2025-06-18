// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, senha } = body;

  if (!email || !senha) {
    return NextResponse.json(
      { error: "Preencha todos os campos" },
      { status: 400 }
    );
  }

  try {
    // Procura usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    // Confere a senha usando bcrypt
    const senhaOk = await bcrypt.compare(senha, user.senha);
    if (!senhaOk) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    // Gerar o JWT!
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7d" }
    );

    // (Opcional) Retornar token JWT aqui, se desejar implementar sessões
    // Neste exemplo, retorna só os dados essenciais do usuário
    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          // nunca envie a senha!
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
