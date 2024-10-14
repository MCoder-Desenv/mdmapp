import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcrypt'; // Importar a biblioteca bcrypt

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Validação simples (você pode querer adicionar mais validações)
  if (!email || !password) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
  }

  try {
    // Procurar o usuário pelo email
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    // Verificar se o usuário existe
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // Comparar a senha fornecida com a senha criptografada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }

    // Aqui você pode definir um token de autenticação ou redirecionar o usuário conforme necessário
    return NextResponse.json({ message: 'Login realizado com sucesso!' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao realizar login.' }, { status: 500 });
  }
}
