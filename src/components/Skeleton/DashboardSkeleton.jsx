// src/components/Skeleton/DashboardSkeleton.jsx
import React from 'react';

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Conteúdo do Skeleton com animação */}
      <div className="animate-pulse w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 sm:p-8">
        {/* 1. Botão Novo Serviço */}
        <div className="w-full flex justify-end">
          <div className="h-10 w-40 bg-yellow-400 rounded-lg shadow-md mt-4"></div>
        </div>

        {/* 2. Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[{ color: 'bg-violet-300' }, { color: 'bg-yellow-300' }, { color: 'bg-green-300' }].map((style, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 h-32 flex flex-col justify-between relative overflow-hidden">
              <div className={`w-10 h-10 rounded-full absolute top-4 right-4 ${style.color}`}></div>
              <div className="flex flex-col">
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className={`h-8 ${style.color.replace('-300', '-500')} rounded w-1/4 opacity-75`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Tabs */}
        <div className="flex gap-2 w-full">
          <div className="h-10 w-40 bg-yellow-400 rounded-lg"></div>
          <div className="h-10 w-48 bg-white rounded-lg border border-gray-100"></div>
        </div>

        {/* 4. Cards de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3 min-h-40">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 w-12 bg-green-400 rounded-full"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="flex justify-between items-center mt-2">
                <div className="h-6 bg-violet-400 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-9 bg-violet-500 rounded-lg flex-1"></div>
                <div className="h-9 bg-red-400 rounded-lg flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
