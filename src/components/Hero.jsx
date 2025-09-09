// src/components/Hero.tsx
import { User, Briefcase, LogIn } from "lucide-react"; // lib de ícones

export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 text-center">
      {/* Título */}
      <h2 className="text-lg font-medium text-gray-500">
        Conecte-se com profissionais qualificados de forma segura e confiável
      </h2>

      {/* Subtítulo */}
      <p className="mt-2 text-gray-700">
        Agende serviços, gerencie pagamentos e encontre os profissionais ideais.
        Cadastre-se como cliente ou ofereça seus serviços como profissional.
      </p>

      {/* Ações */}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <button className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <User size={32} />
          </span>
          <span className="mt-2 text-sm font-medium text-gray-800">
            Área do Cliente
          </span>
        </button>

        <button className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <Briefcase size={32} />
          </span>
          <span className="mt-2 text-sm font-medium text-gray-800">
            Área do Profissional
          </span>
        </button>

        <button className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <LogIn size={32} />
          </span>
          <span className="mt-2 text-sm font-medium text-gray-800">
            Fazer Login
          </span>
        </button>
      </div>
    </section>
  );
}
