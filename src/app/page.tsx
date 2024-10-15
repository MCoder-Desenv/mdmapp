//import Image from "next/image";
'use client'
import Dashboard from "@/components/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
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
    <main>
      <Dashboard />
    </main>
  );
}
