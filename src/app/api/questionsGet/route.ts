import { NextResponse } from 'next/server'
import prismaClient from '@/lib/prisma'

export async function GET() {
  try {
    // Buscando todas as perguntas e as opções relacionadas
    const questions = await prismaClient.question.findMany({
      include: {
        options: true, // Inclui as opções relacionadas à pergunta
      },
    });
    console.log('teste ta passando:', questions)
    // Retorna as perguntas com as opções no formato JSON
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
