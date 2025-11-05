import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CardsSection({ titulo, cards }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="my-10">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="group flex min-w-[160px] flex-col items-center rounded-xl bg-white p-5 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-violet-300"
          >
            {card.icone && (
              <div className="p-3 bg-violet-100 rounded-full mb-3 group-hover:bg-violet-500 transition-colors">
                {React.cloneElement(card.icone, {
                  className: 'w-6 h-6 text-violet-600 group-hover:text-white transition-colors'
                })}
              </div>
            )}
            <p className="text-sm font-semibold text-gray-800">{card.titulo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}