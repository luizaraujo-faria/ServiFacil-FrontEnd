import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, LayoutGrid, Heart, Menu, X } from "lucide-react";


export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/home" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-violet-600 leading-tight">
                ServiFacil
              </span>
              <span className="text-xs sm:text-sm text-gray-600 leading-tight font-semibold">
                Profissionais Verificados
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link 
              to="/home" 
              className="flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium text-sm"
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link 
              to="/categorias" 
              className="flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium text-sm"
            >
              <LayoutGrid className="h-4 w-4" />
              Categorias
            </Link>
            <Link 
              to="/favoritos" 
              className="flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium text-sm"
            >
              <Heart className="h-4 w-4" />
              Favoritos
            </Link>
          </nav>

          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            {open ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 sm:px-6 py-4 space-y-2">
            <Link 
              to="/home" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-800 hover:bg-violet-50 transition-colors font-medium"
            >
              <Home className="h-5 w-5 text-gray-600" />
              Início
            </Link>
            <Link 
              to="/categorias" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-800 hover:bg-violet-50 transition-colors font-medium"
            >
              <LayoutGrid className="h-5 w-5 text-gray-600" />
              Categorias
            </Link>
            <Link 
              to="/favoritos" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-800 hover:bg-violet-50 transition-colors font-medium"
            >
              <Heart className="h-5 w-5 text-gray-600" />
              Favoritos
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}4
