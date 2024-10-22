import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';

// Função POST que recebe o userId no corpo da requisição
export async function POST(request: Request) {
  try {
    // Extrai o userId do corpo da requisição
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Buscar o usuário pelo ID
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId, // Busca o usuário pelo ID
      },
    });

    // Verifica se o usuário foi encontrado
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retorna os dados do usuário
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
