import { User, Briefcase, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mx-auto max-w-2xl text-center">
        
        <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-semibold">
          Conecte-se com os melhores profissionais de forma segura e confiável.
          <br />
          <span className="text-gray-600 font-medium text-base sm:text-lg mt-2 block">Agende serviços, gerencie pagamentos e tenha a melhor experiência com profissionais verificados.</span>
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          <Link 
            to="/cliente" 
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-violet-300"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 shadow-sm transition-all group-hover:bg-violet-600 group-hover:text-white group-hover:scale-110">
              <User size={32} />
            </span>
            <span className="mt-4 text-sm sm:text-base font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
              Área do Cliente
            </span>
          </Link>

          <Link 
            to="/profissional" 
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-yellow-300"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm transition-all group-hover:bg-yellow-600 group-hover:text-white group-hover:scale-110">
              <Briefcase size={32} />
            </span>
            <span className="mt-4 text-sm sm:text-base font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
              Área do Profissional
            </span>
          </Link>

          <Link 
            to="/login" 
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-400"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition-all group-hover:bg-gray-700 group-hover:text-white group-hover:scale-110">
              <LogIn size={32} />
            </span>
            <span className="mt-4 text-sm sm:text-base font-semibold text-gray-800 group-hover:text-gray-700 transition-colors">
              Fazer Login
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}