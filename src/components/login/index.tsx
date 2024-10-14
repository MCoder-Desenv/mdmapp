'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FiLoader, FiLock, FiLogOut, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

// Esquema de validação para login
const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Esquema de validação para registro
const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type UserDataLogin = z.infer<typeof loginSchema>;
type UserDataRegister = z.infer<typeof registerSchema>;

export function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Controle para alternar entre login e registro
  const { status, data: sessionData } = useSession();

  // Hooks de formulário para login
  const { register, handleSubmit, formState: { errors } } = useForm<UserDataLogin>({
    resolver: zodResolver(loginSchema),
  });

  // Hooks de formulário para registro
  const { register: registerRegister, handleSubmit: handleSubmitRegister, formState: { errors: registerErrors }, reset } = useForm<UserDataRegister>({
    resolver: zodResolver(registerSchema),
  });

  // Função para login
  const handleLogin = async (data: UserDataLogin) => {
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    });

    if (res?.error) {
      alert(res.error);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Aguardar breve período
      alert('Logou com sucesso');
      router.push('/questionario');
    }
  
    setLoading(false);
  };

  // Função para registrar novo usuário
  const handleRegister = async (data: UserDataRegister) => {
    try {
      setLoading(true);

      const response = await api.post('/api/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (response.status === 200) {
        alert('Cadastro realizado com sucesso!');
        reset(); // Limpa os campos do formulário
        setIsRegistering(false); // Alterna para o formulário de login
      } else {
        console.error('Erro ao cadastrar:', response.data);
        alert('Ocorreu um erro ao cadastrar.');
      }
    } catch (error) {
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">
          {status === "authenticated" ? "Bem-vindo" : isRegistering ? "Registrar" : "Login"}
        </h2>

        {status === "loading" ? (
          <button className="animate-spin">
            <FiLoader size={26} color="#4b5563" />
          </button>
        ) : status === "authenticated" ? (
          <div className="flex items-baseline gap-4">
            <button onClick={handleLogout}>
              <FiLogOut size={26} color="#ff2313" />
            </button>
          </div>
        ) : (
          <div>
            {isRegistering ? (
              // Formulário de Registro
              <form className="flex flex-col" onSubmit={handleSubmitRegister(handleRegister)}>
                <input
                  type="text"
                  placeholder="Nome"
                  className="mb-2 p-2 border border-gray-300 rounded"
                  {...registerRegister('name')}
                />
                {registerErrors.name && <span className="text-red-500">{registerErrors.name.message}</span>}

                <input
                  type="email"
                  placeholder="Email"
                  className="mb-2 p-2 border border-gray-300 rounded"
                  {...registerRegister('email')}
                />
                {registerErrors.email && <span className="text-red-500">{registerErrors.email.message}</span>}

                <input
                  type="password"
                  placeholder="Senha"
                  className="mb-2 p-2 border border-gray-300 rounded"
                  {...registerRegister('password')}
                />
                {registerErrors.password && <span className="text-red-500">{registerErrors.password.message}</span>}

                <button type="submit" className="mb-4 bg-blue-500 text-white p-2 rounded">
                  {loading ? 'Carregando...' : 'Registrar'}
                </button>

                <p className="text-center">
                  Já tem uma conta?{' '}
                  <span className="text-blue-500 underline cursor-pointer" onClick={() => setIsRegistering(false)}>
                    Fazer login
                  </span>
                </p>
              </form>
            ) : (
              // Formulário de Login
              <form className="flex flex-col" onSubmit={handleSubmit(handleLogin)}>
                <input
                  type="email"
                  placeholder="Email"
                  className="mb-2 p-2 border border-gray-300 rounded"
                  {...register('email')}
                />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                <input
                  type="password"
                  placeholder="Senha"
                  className="mb-2 p-2 border border-gray-300 rounded"
                  {...register('password')}
                />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                <button type="submit" className="mb-4 bg-blue-500 text-white p-2 rounded">
                  {loading ? 'Carregando...' : 'Entrar'}
                </button>
                {status === "unauthenticated" && (
                  <p className="text-center">
                    Não tem uma conta?{' '}
                    <span className="text-blue-500 underline cursor-pointer" onClick={() => setIsRegistering(true)}>
                      Criar conta
                    </span>
                  </p>
                  )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
