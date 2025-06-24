// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { error: "Configuração do servidor ausente." },
      { status: 500 }
    );
  }
  const body = await request.json();
  const { email, senha }: { email?: string; senha?: string } = body;

  if (typeof email !== "string" || typeof senha !== "string") {
    return NextResponse.json(
      { error: "Dados inválidos" },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json(
      { error: "Email inválido" },
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

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // 🎯 Definir cookie no response
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
