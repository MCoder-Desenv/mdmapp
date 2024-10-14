'use client'
import { useState } from 'react';
import { FaHome, FaQuestionCircle, FaCog, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Importando ícones
import '../font.css'; // Adicione esta linha para importar as fontes
import Link from 'next/link';


export function SideBar() {
    const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar a visibilidade da sidebar

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
      <div className="flex">
        <div className={`h-screen bg-[#F9F9F9] p-4 ${isCollapsed ? 'w-16' : 'w-[180px]'}`}>
          <button onClick={toggleSidebar} className="flex items-center mb-4">
            {isCollapsed ? <FaArrowRight /> : <FaArrowLeft />} {/* Ícone para minimizar/expandir */}
          </button>

          {/* Primeira div - Logo e App Name */}
          {/* <div className={`h-[12%] bg-gray-200 flex items-center gap-x-2 ${isCollapsed ? 'justify-center' : ''}`}> */}
           {/* {!isCollapsed && <img src="/logo.png" alt="Logo" className="w-8 h-8" />} */} {/* Exibe a logo apenas se não estiver minimizada */}
            {/*{!isCollapsed && <span className="font-manrope font-bold text-[22px] text-[#D9A13D]">App - MP</span>}*/}  {/* Exibe o texto apenas se não estiver minimizada */}
          {/* </div> */}

          {/* Segunda div - Dashboard */}
          <div className={`mt-[15.45%] h-[8%] flex items-center gap-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <FaHome className="text-[#878787]" />
            <Link href="/">
              {!isCollapsed && <span className="font-manrope text-[18px] text-[#878787]">Página Inicial</span>}
            </Link>
          </div>

          {/* Terceira div - Questionário */}
          <div className={`mt-[5.82%] h-[8%] flex items-center gap-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <FaQuestionCircle className="text-[#878787]" />
            <Link href="/questionario">
              {!isCollapsed && <span className="font-manrope text-[18px] text-[#878787]">Questionário</span>}
            </Link>
          </div>

           {/* Terceira div - Diagnóstico */}
           <div className={`mt-[5.82%] h-[8%] flex items-center gap-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <FaQuestionCircle className="text-[#878787]" />
            <Link href="/answers">
              {!isCollapsed && <span className="font-manrope text-[18px] text-[#878787]">Diagnóstico</span>}
            </Link>
          </div>

          {/* Linha separadora */}
          {/* <div className="border-t border-gray-400 my-4"></div> */}

          {/* Quarta div - Configurações */}
          {/* <div className={`mt-[9.82%] h-[8%] flex items-center gap-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <FaCog className="text-[#878787]" />
            {!isCollapsed && <span className="font-manrope text-[18px] text-[#878787]">Configurações</span>}
          </div> */}
        </div>

        {/*<Header isCollapsed={isCollapsed} />  Passando o estado da sidebar para o header */}
      </div>
    );
}
