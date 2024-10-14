// Importa a biblioteca NextAuth para autenticação e as tipagens necessárias
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Provedor de credenciais para autenticação personalizada
import { PrismaAdapter } from "@auth/prisma-adapter"; // Adaptador para integrar com o Prisma
import prismaClient from "./prisma"; // Cliente Prisma para interagir com o banco de dados
import bcrypt from "bcrypt"; // Biblioteca para criptografia de senhas

// Interface para estender a tipagem do usuário
interface CustomUser extends User {
  id: string; // Customização para incluir o ID no tipo de User
}

// Configurações de autenticação
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaClient), // Adaptador do Prisma para conectar o NextAuth ao banco de dados Prisma
  providers: [
    // Provedor de credenciais personalizado para login
    CredentialsProvider({
      name: "Credentials", // Nome que será exibido para o provedor
      credentials: {
        // Campos que o usuário preenche na página de login
        email: { label: "Email", type: "text", placeholder: "seu-email@exemplo.com" }, // Campo de email
        password: { label: "Senha", type: "password" }, // Campo de senha
      },
      async authorize(credentials) {
        // Função de autorização que valida o login do usuário
        if (!credentials) return null;

        // Busca o usuário no banco de dados pelo email informado
        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
        });

        // Verifica se o usuário foi encontrado e se a senha está correta
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          // Se estiver tudo certo, retorna os dados do usuário (sem a senha)
          return { id: user.id.toString(), name: user.name, email: user.email };
        }
        return null; // Retorna null se a autenticação falhar
      },
    }),
  ],
  callbacks: {
    // Callback JWT para modificar o token JWT e adicionar informações personalizadas
    async jwt({ token, user }) {
      if (user) {
        // Adiciona o ID e email do usuário ao token
        token.id = user.id;
        token.email = user.email;
      }
      return token; // Retorna o token atualizado
    },
    // Callback de sessão para modificar os dados da sessão do usuário
    async session({ session, token }) {
      if (token) {
        // Adiciona o ID e o email do usuário à sessão
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        console.log("teste34798675"); // Log para verificar a chamada do callback de sessão
      }
      return session; // Retorna a sessão atualizada
    },
  },
  pages: {
    //Esta configuração define as páginas personalizadas que o NextAuth usa. Aqui, foi definida uma página de login personalizada, 
    //que será exibida quando um usuário não autenticado tentar acessar uma rota protegida. O valor 'signIn: '/login' faz com que a página /login 
    //seja a página de login padrão.
    
    signIn: '/login', // Define uma página de login personalizada, aqui '/login' é o caminho para a página de login
  },
  session: {
    strategy: "jwt", // Define que a estratégia de sessão é baseada em JWT, ao invés de armazenar sessões no servidor
  },
};

// Exporta a configuração do NextAuth
export default NextAuth(authOptions);
