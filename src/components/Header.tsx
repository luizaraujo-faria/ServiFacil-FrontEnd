import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">

        <button
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100 active:scale-95"
        >
          {/* Ícone ☰ como SVG para melhor acessibilidade */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Título */}
        <h1 className="m-0 text-[18px] font-bold leading-none">
          <span className="text-emerald-500">ServiFácil</span>
          <span className="text-[#1A093E]"> - Conecte-se aos melhores profissionais</span>
        </h1>
      </div>

      {open && (
        <div className="border-t bg-white/95 px-4 py-3 shadow-sm sm:hidden">
          <nav className="flex flex-col gap-2 text-sm text-[#1A093E]">
            <button className="rounded-md px-3 py-2 text-left hover:bg-gray-100">Início</button>
            <button className="rounded-md px-3 py-2 text-left hover:bg-gray-100">Categorias</button>
            <button className="rounded-md px-3 py-2 text-left hover:bg-gray-100">Favoritos</button>
          </nav>
        </div>
      )}
    </header>
  );
}
