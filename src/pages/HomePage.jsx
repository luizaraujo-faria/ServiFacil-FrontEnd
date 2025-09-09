// src/pages/HomePage.tsx
import Header from "../components/Header";
import Hero from "../components/Hero";
import CardsSection from "../components/CardsSection";
import { Home, Wrench, PawPrint, Bath, Hammer, CreditCard, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16">
        <Hero />

        <div className="space-y-10">
          {/* Nossos Serviços */}
          <CardsSection
            titulo="Nossos Serviços"
            cards={[
              { titulo: "Para Clientes", icone: <Users /> },
              { titulo: "Para Profissionais", icone: <Wrench /> },
              { titulo: "Pagamentos Seguros", icone: <CreditCard /> },
            ]}
          />

          {/* Tipos de Serviços */}
          <CardsSection
            titulo="Tipos de Serviços"
            cards={[
              { titulo: "Serviços Domésticos", icone: <Home /> },
              { titulo: "Cuidados Pessoais", icone: <Bath /> },
              { titulo: "Cuidado com Animais", icone: <PawPrint /> },
              { titulo: "Manutenção", icone: <Wrench /> },
              { titulo: "Reformas", icone: <Hammer /> },
              { titulo: "Outros Serviços" },
            ]}
          />

          {/* Categoria de Serviços */}
          <CardsSection
            titulo="Categoria de Serviços"
            cards={[
              { titulo: "Cadastre-se" },
              { titulo: "Encontre Serviços" },
              { titulo: "Agende" },
              { titulo: "Pague com Segurança", icone: <CreditCard /> },
              { titulo: "Histórico" },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
