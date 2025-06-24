import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });

    // Mapeando o resultado para um formato mais "limpo"
    const data = posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      user: post.author.name,
      userImage: post.author.image,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts.' }, { status: 500 });
  }
}