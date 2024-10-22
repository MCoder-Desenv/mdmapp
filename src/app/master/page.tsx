// App/master/index.tsx
'use client'
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const MasterDashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }  // Adicione este retorno para evitar renderização antes da autenticação
  
    if (status === 'unauthenticated') {
        router.push('/');
    }
  }, [status, router]);
  return (
    <div>
      <h1>Painel do Usuário Master</h1>
      <nav>
        <ul>
          <li>
            <Link href="/master/students">Ver Alunos</Link>
          </li>
          <li>
            <Link href="/master/questions">Gerenciar Perguntas</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MasterDashboard;
