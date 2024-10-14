// App/master/index.tsx
import Link from 'next/link';

const MasterDashboard = () => {
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
