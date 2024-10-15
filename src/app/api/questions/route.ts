
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prismaClient from '@/lib/prisma'


export async function POST(request: Request){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  const { questionText, options } = await request.json();

  // Certifique-se de que 'options' é um array de objetos com a propriedade 'optionText'
  if (!Array.isArray(options) || options.length === 0) {
    return NextResponse.json({ error: "Options must be an array and cannot be empty." }, { status: 400 });
  }


  try{
    await prismaClient.question.create({
      data:{
        questionText,
        options: {
            create: options.map((option: { optionText: string, optionValue: string }) => ({
              optionText: option.optionText,
              optionValue: option.optionValue
            })),
          },
      }
    })

    return NextResponse.json({ message: "Pergunta cadastrada com sucesso!" })

  }catch(err){
    return NextResponse.json({ error: "Failed crete new question" }, { status: 400 })
  }

}