import React from 'react';
import Ilustracao from '../assets/image.png';

import Header from '../components/Header';
import Hero from '../components/Hero';
import CardsSection from '../components/CardsSection'; 
import Footer from '../components/Footer';

import {
  Home,
  Heart,
  PawPrint,
  Wrench,
  Paintbrush,
  ArrowRight,
  UserPlus,
  Search,
  Calendar,
  Shield,
  History,
} from 'lucide-react';

const tiposDeServicos = [
  { titulo: 'Serviços Domésticos', icone: <Home /> },
  { titulo: 'Cuidados Pessoais', icone: <Heart /> },
  { titulo: 'Cuidado com Animais', icone: <PawPrint /> },
  { titulo: 'Manutenção', icone: <Wrench /> },
  { titulo: 'Reformas', icone: <Paintbrush /> },
  { titulo: 'Outros Serviços', icone: <ArrowRight /> },
];

const comoFunciona = [
  { titulo: 'Cadastre-se', icone: <UserPlus /> },
  { titulo: 'Encontre Serviços', icone: <Search /> },
  { titulo: 'Agende', icone: <Calendar /> },
  { titulo: 'Pague com Segurança', icone: <Shield /> },
  { titulo: 'Histórico', icone: <History /> },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen">
      
      <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen bg-gradient-to-br from-violet-100 to-yellow-50 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-8">
          <img
            src={Ilustracao}
            alt="Ilustração ServiFacil"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col min-h-screen bg-white">
        
        <Header />

        <div className="flex-1 overflow-y-auto">
          
          <Hero />

          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto">
              
              <CardsSection 
                titulo="Tipos de Serviços" 
                cards={tiposDeServicos} 
              />

              <CardsSection 
                titulo="Como Funciona" 
                cards={comoFunciona} 
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}