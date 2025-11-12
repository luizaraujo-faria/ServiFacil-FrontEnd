export const ReviewsSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      {/* Esqueleto dos Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Avaliação Média */}
        <div className="bg-white rounded-lg shadow-md p-6 h-40 flex flex-col items-center justify-center">
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 bg-yellow-400 rounded w-1/4"></div>
            <div className="w-8 h-8 bg-yellow-200 rounded-full"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Card 2: Total de Avaliações */}
        <div className="bg-white rounded-lg shadow-md p-6 h-40 flex flex-col items-center justify-center">
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
          <div className="h-8 bg-blue-400 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Card 3: Distribuição */}
        <div className="bg-white rounded-lg shadow-md p-6 h-40 flex flex-col justify-start">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="h-3 bg-gray-300 rounded w-8"></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2"></div>
                <div className="h-3 bg-gray-300 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Esqueleto da Área "Nenhuma avaliação recebida ainda" */}
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
};

export default ReviewsSkeleton;
