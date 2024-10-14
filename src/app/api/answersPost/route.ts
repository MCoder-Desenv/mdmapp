import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  // if (session.user.id == '1') {
  //   console.log("usuario duplicado")
  //   return NextResponse.json({ error: "usuario duplicado" }, { status: 401 });
  // }

  const { answers } = await request.json(); // Esperando um array de respostas

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers must be an array and cannot be empty." }, { status: 400 });
  }

  try {
    // Itera sobre as respostas e salva cada uma
    for (const answer of answers) {
      const { questionId, optionId } = answer; // A resposta deve conter o ID da pergunta e da opção escolhida
      
      await prismaClient.answer.create({
        data: {
          userId: Number(session.user.id), // Assumindo que a ID do usuário está disponível na sessão
          questionId,
          optionId
        },
      });
    }

    return NextResponse.json({ message: "Respostas cadastradas com sucesso!" });
  } catch (err) {
    console.error(err); // Log do erro para facilitar a depuração
    return NextResponse.json({ error: "Falha ao cadastrar as respostas" }, { status: 400 });
  }
}
