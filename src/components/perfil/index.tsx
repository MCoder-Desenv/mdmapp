// components/Perfil.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api'; // seu serviço para chamadas API
import { FiLock, FiCamera } from 'react-icons/fi';

export default function Perfil() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [image, setImage] = useState<File | null>(null); // Armazena como File ou null
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async () => {
    if (password && password !== confirmPassword) {
      setMessage('As senhas não coincidem!');
      return;
    }

    try {
      setLoading(true);

      // Criação de um objeto FormData
      const formData = new FormData();
      formData.append('id', session?.user.id || '');
      formData.append('name', name);
      if (image) {
        formData.append('image', image); // Apenas adiciona se image não for null
      }
      if (password) {
        formData.append('password', password); // Enviar senha apenas se estiver preenchida
      }

      // Envio da requisição usando FormData
      const response = await api.post('/api/profilePost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Define o Content-Type como multipart/form-data
        },
      });

      if (response.status === 200) {
        setMessage('Perfil atualizado com sucesso!');
      } else {
        setMessage('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error); // Logar o erro para mais detalhes
      setMessage('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Armazena o arquivo diretamente
    }
  };

  console.log(session?.user?.image)

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <div className="text-center mb-6 relative">
        {/* <label htmlFor="imageUpload" className="relative cursor-pointer inline-block">
          <img
            src={image ? URL.createObjectURL(image) : session?.user?.image || '/default-profile.png'}
            alt="Imagem de perfil"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
          <FiCamera className="absolute inset-0 m-auto w-6 h-6 text-gray-700 bg-gray-200 p-1 rounded-full opacity-80" />
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label> */}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-center text-xl font-semibold mt-2 border-none focus:ring-0"
        />
        <p className="text-gray-600">{session?.user?.email}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Alterar Senha</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}

          <button
            onClick={handleProfileUpdate}
            className="flex items-center justify-center w-full py-2 px-4 bg-[#BFB2A3] text-white rounded-md hover:bg-[#a68d83] transition"
            disabled={loading}
          >
            {loading ? (
              <FiLock className="animate-spin mr-2" />
            ) : (
              'Atualizar Perfil'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
