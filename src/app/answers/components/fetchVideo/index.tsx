import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function VideoComponent() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await api.get('/archivesFiles/apresentacao.mp4', {
          responseType: 'blob', // Para garantir que o vídeo seja tratado como arquivo
        });
        const videoBlob = URL.createObjectURL(response.data);
        setVideoUrl(videoBlob); // Definindo a URL do vídeo no estado
      } catch (error) {
        console.error('Erro ao carregar o vídeo:', error);
      }
    }

    fetchVideo();
  }, []);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">Opção 1: Vídeo Local</h3>
      <div className="relative pb-9/16 h-0 overflow-hidden">
        {videoUrl ? (
          <video className="absolute top-0 left-0 w-full h-full" controls src={videoUrl}>
            Seu navegador não suporta a exibição de vídeos.
          </video>
        ) : (
          <p>Carregando vídeo...</p>
        )}
      </div>
    </div>
  );
}
