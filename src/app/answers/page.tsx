'use client'
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart, { ArcElement, Legend, Tooltip } from 'chart.js/auto';
import { api } from '@/lib/api';
import { Header } from '@/components/header';
import { SideBar } from '@/components/sideBar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Importar o useRouter
import React from 'react'
import ReactPlayer from 'react-player'

Chart.register(ArcElement, Tooltip, Legend);

interface ReportData {
  Inocente: number;
  Coadjuvante: number;
  Aleatório: number;
  Intencional: number;
}

export default function Relatorio() {
  const [data, setData] = useState<ReportData | null>(null);
  const [description, setDescription] = useState('');
  const [improvementMessage, setImprovementMessage] = useState('');
  const { data: session, status } = useSession();
  const [playerSize, setPlayerSize] = useState({ width: '100%', height: 'auto' });
  const router = useRouter(); // Inicializar o router

  useEffect(() => {
    if (status === 'loading') return; // Adicione este retorno para evitar renderização antes da autenticação
  
    if (status === 'unauthenticated') {
        router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {

      // Verifique se a sessão está autenticada
      if (status === 'authenticated' && session?.user.id) {
        try {
          const response = await api.post('/api/answersGet', {
            userId: Number(session.user.id), // Certifique-se de que o ID do usuário está sendo passado corretamente
          });
          const reportData = await response.data;
          if (response.status === 200) {
            setData(reportData);
            generateImprovementMessage(reportData);
          } else {
            setData(null);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do relatório:', error);
        }
      } else {
        setData(null);
        console.log("Usuário não autenticado ou userId não encontrado");
      }
    }

    fetchData();
  }, [session, status]);

  // Função para gerar a mensagem de melhoria com base nos percentuais
  const generateImprovementMessage = (reportData: ReportData) => {
    const categories = ['Inocente', 'Coadjuvante', 'Aleatório', 'Intencional'];
    const sortedCategories = categories.sort((a, b) => reportData[b as keyof ReportData] - reportData[a as keyof ReportData]);

    const highest = sortedCategories[0];
    const secondHighest = sortedCategories[1];

    let message = '';

    if (highest === 'Inocente' && secondHighest === 'Aleatório') {
      message = 'Você parece ser uma pessoa muito empática, mas em algumas situações pode agir de forma despretensiosa. Tente manter o foco!';
    } else if (highest === 'Intencional') {
      message = 'Você é uma pessoa determinada! Continue assim, mas cuide para não ignorar outros pontos de vista.';
    } else if (highest === 'Coadjuvante') {
      message = 'Você prefere apoiar, o que é ótimo, mas também busque tomar a frente quando necessário!';
    }
    // Outras combinações podem ser adicionadas conforme necessário
    setImprovementMessage(message);
  };

  // Lógica para calcular os dados do gráfico com porcentagens
  const calculateChartData = (data: ReportData | null) => {
    if (!data) return { labels: [], values: [] };

    const categories: (keyof ReportData)[] = ['Inocente', 'Coadjuvante', 'Aleatório', 'Intencional'];
    const values = categories.map((category) => data[category]);

    const total = values.reduce((sum, value) => sum + value, 0);
    const percentages = values.map(value => ((value / total) * 100).toFixed(2));

    return {
      labels: categories,
      values: percentages,
    };
  };

  const [chartSize, setChartSize] = useState({ width: 96, height: 96 });

  useEffect(() => {
    const updateChartSize = () => {
      if (window.innerWidth < 1080) {
        setChartSize({ width: 64, height: 64 });
      } else {
        setChartSize({ width: 96, height: 96 });
      }
    };

    window.addEventListener('resize', updateChartSize);
    updateChartSize();

    return () => window.removeEventListener('resize', updateChartSize);
  }, []);

  useEffect(() => {
    const updatePlayerSize = () => {
      if (window.innerWidth < 640) { // Celular
        setPlayerSize({ width: '100%', height: '70%' });
      } else if (window.innerWidth < 1024) { // Tablet
        setPlayerSize({ width: '80%', height: 'auto' });
      } else { // Computador
        setPlayerSize({ width: '540px', height: '340px' });
      }
    };

    window.addEventListener('resize', updatePlayerSize);
    updatePlayerSize();

    return () => window.removeEventListener('resize', updatePlayerSize);
  }, []);

  const chartData = calculateChartData(data);

  return (
    <main className="flex flex-col items-center p-4">
      <div className="fixed mr-16 top-0 w-full z-10 ">
        <Header />
      </div>
      <div className="fixed top-[64px] left-0 h-screen z-10 ">
        <SideBar />
      </div>
      {status === 'loading' ? ( // Renderize um loader enquanto está carregando
        <div>Loading...</div>
      ) : data != null ? (
        <>
          <h1 className="text-2xl font-bold">Relatório de Respostas</h1>
          <div className={`w-${chartSize.width} h-${chartSize.height}`}>
            <Pie
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.values,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const label = chartData.labels[tooltipItem.dataIndex] || '';
                        const value = chartData.values[tooltipItem.dataIndex] || 0;
                        return `${label}: ${value}%`; // Exibe o percentual no tooltip
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Assista o vídeo</h2>
            <div className="mt-4 w-full flex justify-center">
              <ReactPlayer
                url='https://www.youtube.com/watch?v=SPzrhtGjL_U'
                controls
                width={playerSize.width} // Define a largura do player com base na tela
                height={playerSize.height} // Define a altura do player como auto
                style={{ maxWidth: '1920px', height: '1080px' }} // Define limites máximos para o player
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Assista o vídeo</h2>
            <div className="mt-4 w-full flex justify-center">
              <ReactPlayer
                url='https://www.youtube.com/watch?v=SPzrhtGjL_U'
                controls
                width={playerSize.width} // Define a largura do player com base na tela
                height={playerSize.height} // Define a altura do player como auto
                style={{ maxWidth: '1920px', height: '1080px' }} // Define limites máximos para o player
              />
            </div>
          </div>
      )}
    </main>
  );
}
