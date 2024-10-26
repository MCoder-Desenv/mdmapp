'use client'

import { useSession } from 'next-auth/react';
import { Login } from '@/components/login';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { SideBar } from "@/components/sideBar";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }  // Adicione este retorno para evitar renderização antes da autenticação
  
    if (status === 'unauthenticated') {
        router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const checkAnswered = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await api.post('/api/answersGet', {
            userId: Number(session?.user.id),
          });
  
          //console.log(response); // Verifique o conteúdo retornado
  
          // Verifica se `response.data` é um array
          if (response.status === 200) {
            setHasAnswered(true);
          } else {
            setHasAnswered(false);
          }
        } catch (error) {
          console.error('Erro ao verificar se o usuário respondeu ao questionário:', error);
        }
      }
      setLoading(false);
    };
  
    checkAnswered();
  }, [session, status]);
  
  

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {status === 'unauthenticated' ? (
        // Renderiza o componente de Login se o usuário não estiver autenticado
       <div className='flex'>
        <Login />
       </div>
      ) : (
        // Caso o usuário esteja logado, exibe a mensagem
        <div>
            <div className="fixed top-0 w-full z-10">
                <Header />
            </div>
            <div className="fixed top-[64px] left-0 h-screen z-10">
                <SideBar />
            </div>
        
            {/* Box centralizado */}
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-4 mt-16">
                <h1 className="text-2xl font-semibold mb-4">Bem-vindo(a), {session?.user?.name}!</h1>
                {hasAnswered ? (
                    <p className="text-lg text-green-600">Você já respondeu ao questionário.</p>
                ) : (
                    <p className="text-lg text-red-600">Você ainda não respondeu ao questionário. Por favor, complete o questionário.</p>
                )}
                </div>
            </div>
        </div>
      )}
    </>
  );
}
