// src/components/CardsCarousel.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Card = {
  titulo: string;
  icone?: React.ReactNode;
};

type Props = {
  titulo: string;
  cards: Card[];
};

export default function CardsCarousel({ titulo, cards }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="my-8">
      {/* Cabeçalho */}
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1A093E]">{titulo}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Cards roláveis */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex min-w-[150px] flex-col items-center justify-center rounded-xl bg-emerald-200 p-6 shadow-sm hover:bg-emerald-300"
          >
            {card.icone && <div className="mb-2">{card.icone}</div>}
            <p className="font-medium text-[#1A093E]">{card.titulo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
