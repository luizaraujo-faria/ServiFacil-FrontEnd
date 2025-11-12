// src/components/Skeleton/EditServiceSkeleton.jsx
import React from 'react';

const EditServiceSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="mb-6">
      {/* Botão Voltar */}
      <div className="h-5 bg-gray-200 rounded-lg w-40 mb-4"></div>
      <div className="flex justify-between items-start">
        {/* Título Principal */}
        <div className="h-8 bg-gray-300 rounded-lg w-52"></div>
        {/* Botão Excluir */}
        <div className="h-10 bg-red-200 rounded-lg w-28"></div>
      </div>
    </div>

    {/* Formulário Skeleton */}
    <div className="bg-white rounded-xl shadow-2xl p-6 space-y-6 border border-gray-100">
      {/* Título */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-gray-100 rounded-lg w-full border border-gray-200"></div>
        <div className="h-3 bg-gray-100 rounded w-1/4 mt-1"></div>
      </div>

      {/* Categoria */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-10 bg-gray-100 rounded-lg w-full border border-gray-200"></div>
      </div>

      {/* Preço */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
        <div className="h-10 bg-gray-100 rounded-lg w-full border border-gray-200"></div>
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-1"></div>
      </div>

      {/* Status */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
        <div className="h-10 bg-gray-100 rounded-lg w-full border border-gray-200"></div>
      </div>

      {/* Detalhes */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-32 bg-gray-100 rounded-lg w-full border border-gray-200"></div>
        <div className="h-3 bg-gray-100 rounded w-1/4 mt-1"></div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-12 bg-yellow-300 rounded-lg"></div>
      </div>
    </div>

    {/* Info Block Skeleton */}
    <div className="mt-6 h-28 bg-blue-100 border border-blue-200 rounded-xl"></div>
  </div>
);

export default EditServiceSkeleton;
