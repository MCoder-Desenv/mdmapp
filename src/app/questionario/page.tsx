'use client'
import { useEffect, useState } from "react";
import { FiUser, FiLogOut, FiLoader, FiLock } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api'
import { Header } from "@/components/header";
import { SideBar } from "@/components/sideBar";

interface Answer {
  optionValue: string;
  optionId: number; // ID da opção escolhida
}

interface Option {
  id: number; // ou string, dependendo da sua implementação
  questionId: number; // ou string, dependendo da sua implementação
  optionText: string; // texto que será mostrado ao usuário
  optionValue: string; // valor que será usado internamente (por exemplo, ao armazenar a resposta)
  answer: Answer[];
}

interface Question {
  id: number;
  questionText: string;
  options: Option[]; // Agora 'options' é um array de objetos do tipo 'Option'
  answer: Answer[];
}


export default function Questionario() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false); // Adicione esta linha para armazenar se o usuário já respondeu
  const [isClient, setIsClient] = useState(false); // Nova flag para verificar se estamos no lado do cliente

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }  // Adicione este retorno para evitar renderização antes da autenticação
  
    if (status === 'unauthenticated') {
        router.push('/');
    }
  }, [status, router]);

  //alert("idjhsifhidhsifods")

  // useEffect para verificar se o usuário já respondeu ao questionário
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

  //console.log(hasAnswered)

  // Verifica se estamos no lado do cliente
  useEffect(() => {
    setIsClient(true); // Seta a flag como true quando o componente for montado no cliente
  }, []);

  // Agora usamos o useRouter apenas se estivermos no lado do cliente
  

  // Função para buscar as perguntas da API
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/api/questionsGet");
        const data: Question[] = await response.json();
        setQuestions(data);
        setAnswers(Array(data.length).fill("")); // Inicializa as respostas
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Função para avançar para a próxima pergunta ou enviar o quiz
  const handleNext = async () => {
    if (!answers[currentQuestion]) {
      alert("Por favor, selecione uma opção antes de continuar.");
      return;
    }
  
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      try {
        // Enviar as respostas para a API usando `api.post`
        const response = await api.post('/api/answersPost', {
          userId: Number(session?.user.id), // ajuste se o userId for dinâmico
          answers: answers.map((answer, index) => ({
            questionId: questions[index].id,
            optionId: answer.optionId
          })),
        });
  
        if (response.status === 200) {
          alert('Dados salvos com sucesso!');
          router.push('/answers'); // se for usar redirecionamento
        } else {
          console.error('Erro ao salvar respostas:', response.data);
          alert('Ocorreu um erro ao salvar suas respostas.');
        }
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Ocorreu um erro ao enviar seus dados.');
      }
    }
  };

  // Função para voltar para a pergunta anterior
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Função para selecionar uma opção
  const handleSelectOption = (option: { optionId: number; optionValue: string }) => {
    const updatedAnswers = [...answers];
    // Armazenamos um objeto com o id e o valor da opção
    updatedAnswers[currentQuestion] = option;
    setAnswers(updatedAnswers);
  };


  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <FiLoader size={50} className="animate-spin" />
      </main>
    );
  }

  return (
    
    <main className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="fixed top-0 mr-16 w-full z-10 ">
      <Header/>
     </div> 
     <div className="fixed top-[64px] left-0 h-screen z-10 ">
        <SideBar/>
      </div>
      {hasAnswered ? (
        <div className="bg-white p-4 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold text-center">Você já respondeu ao questionário!</h2>
        <p className="text-center">Obrigado por participar.</p>

      </div> // Renderizando o box quando já respondido
      ) : !questions[currentQuestion] ? (
        <div>Nenhuma pergunta disponível.</div>
      ) : (
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg space-y-6">
          <div className="bg-[#BFB2A3] p-4 rounded-md flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white mr-4">
              {currentQuestion + 1}
            </div>
            <h2 className="text-xl font-bold text-white">
              {questions[currentQuestion]?.questionText}
            </h2>
          </div>
          <div className="p-2">
            <div className="space-y-3">
              <ol className="list-none space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestion}`}
                      className="mr-3 h-4 w-4 rounded-full border-gray-300"
                      value={option.optionValue}
                      // Verifica se a opção atual é a selecionada
                      checked={answers[currentQuestion]?.optionValue === option.optionValue}
                      onChange={() => handleSelectOption({ optionId: option.id, optionValue: option.optionValue })}
                    />
                    <label htmlFor={`option-${index}`} className="text-black cursor-pointer">
                      {option.optionText}
                    </label>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-row justify-end items-center mt-4 pb-3 mr-4 overflow-hidden">
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                currentQuestion === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              } mr-2`}
              disabled={currentQuestion === 0}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#BFB2A3] text-white rounded-lg hover:bg-[#a68d83] transition-all duration-300 ease-in-out"
            >
              {currentQuestion < questions.length - 1 ? "Nex" : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

