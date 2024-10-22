// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import prismaClient from '@/lib/prisma';
// import bcrypt from 'bcrypt';
// import formidable from 'formidable';
// import fs from 'fs';

// // Definição da interface para os campos do formulário
// interface FormFields {
//   name?: string;
//   password?: string;
//   image?: formidable.File; // Usar o tipo File do formidable
// }

// // Função para configurar o formidable
// const parseForm = (req: NextRequest) => {
//   const form = formidable({
//     uploadDir: './public/uploads',
//     keepExtensions: true,
//   });

//   return new Promise<{ fields: FormFields; files: formidable.Files }>((resolve, reject) => {
//     form.parse(req as any, (err: Error | null, fields: FormFields, files: formidable.Files) => {
//       if (err) return reject(err);
//       resolve({ fields, files });
//     });
//   });
// };

// // Função principal do endpoint
// export async function POST(req: NextRequest) {
//   // Corrigindo a chamada para getServerSession
//   const session = await getServerSession(authOptions); // Aqui, você não precisa passar o req

//   if (!session || !session.user) {
//     return NextResponse.json({ error: "Not authorized" }, { status: 401 });
//   }

//   try {
//     const { fields, files } = await parseForm(req);

//     const { name, password } = fields;
//     let imagePath = '';

//     if (files.image) {
//       const file = files.image[0]; // Acessando o primeiro arquivo da array
//       const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
//       imagePath = `/uploads/${uniqueSuffix}-${file.originalFilename}`;
//       await fs.promises.rename(file.filepath, `./public${imagePath}`);
//     }

//     const updateData: any = {};
//     if (name) updateData.name = name;
//     if (imagePath) updateData.image = imagePath;
//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json({ error: "Nenhum dado para atualizar." }, { status: 400 });
//     }

//     await prismaClient.user.update({
//       where: { id: Number(session.user.id) },
//       data: updateData,
//     });

//     return NextResponse.json({ message: "Perfil atualizado com sucesso!" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Erro ao atualizar o perfil" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcrypt';
import fs from 'fs';

// Função principal do endpoint
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.formData(); // Pega os dados do formulário diretamente
    const name = body.get('name') as string | null;
    const password = body.get('password') as string | null;;
    const image = body.get('image') as File;

    let imagePath = '';

    if (image) {
      const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      imagePath = `/uploads/${uniqueSuffix}-${image.name}`;
      const buffer = await image.arrayBuffer(); // Convertendo a imagem para buffer
      await fs.promises.writeFile(`./public${imagePath}`, Buffer.from(buffer)); // Escrevendo a imagem no disco
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (imagePath) updateData.image = imagePath;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhum dado para atualizar." }, { status: 400 });
    }

    await prismaClient.user.update({
      where: { id: Number(session.user.id) },
      data: updateData,
    });

    return NextResponse.json({ message: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar o perfil" }, { status: 500 });
  }
}
