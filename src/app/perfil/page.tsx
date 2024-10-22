// app/perfil/page.tsx
import { Header } from '@/components/header';
import { SideBar } from '@/components/sideBar';
import Perfil from '@/components/perfil';

export default function PerfilPage() {
  return (
    <main className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="fixed top-0 mr-16 w-full z-10">
        <Header />
      </div>
      <div className="fixed top-[64px] left-0 h-screen z-10">
        <SideBar />
      </div>

      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mt-20">
        <Perfil />
      </div>
    </main>
  );
}
