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

    // Buscar todas as respostas do usuário logado
    const answers = await prismaClient.answer.findMany({
      where: {
        userId: userId, // Filtra pelas respostas do usuário
      },
      include: {
        option: {
          select: {
            optionValue: true, // Pega o valor da opção (Inocente, Coadjuvante, Aleatório, Intencional)
          },
        },
      },
    });

    if (answers.length > 0) {
      // Inicializa um objeto para contar as ocorrências de cada tipo de opção
      const reportData: { [key: string]: number } = {
        Inocente: 0,
        Coadjuvante: 0,
        Aleatório: 0,
        Intencional: 0,
      };

      // Conta quantas vezes cada tipo de opção foi escolhida
      answers.forEach(answer => {
        const optionValue = answer.option.optionValue as keyof typeof reportData;
        if (reportData[optionValue] !== undefined) {
          reportData[optionValue]++;
        }
      });
      //Voltar aqui amanha para arrumar porque está pegando um array de 0, está pegando o reportData dos tipos e não retornando a query
      //console.log(reportData);
      // Retorna o objeto com os dados das respostas
      return NextResponse.json(reportData, { status: 200 });
    }
    else {
      return NextResponse.json("Nenhum relatorio cadastrado", { status: 201 })
    }
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}
