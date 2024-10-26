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

type UserDataLogin = z.infer<typeof loginSchema>;

export function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Controle para alternar entre login e registro
  const { status, data: sessionData } = useSession();

  // Hooks de formulário para login
  const { register, handleSubmit, formState: { errors } } = useForm<UserDataLogin>({
    resolver: zodResolver(loginSchema),
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
      if (res?.status == 401) {
        alert("Senha incorreta");
      } else {
        alert(res.error);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Aguardar breve período
      alert('Logou com sucesso');
      router.push('/questionario');
    }

    setLoading(false);
  };

  // Função para logout
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen flex-1">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm m-4">
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
            {/* Formulário de Login */}
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
}