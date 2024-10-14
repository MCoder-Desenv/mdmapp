import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcrypt'; // Importar a biblioteca bcrypt

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // Validação simples (você pode querer adicionar mais validações)
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
  }

  try {
    // Criptografar a senha antes de armazená-la
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Use a senha criptografada aqui
      },
    });

    return NextResponse.json({ message: 'Conta criada com sucesso!', status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });
  }
}
