export default function ServiceDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse flex flex-col lg:flex-row gap-6">
      {/* COLUNA ESQUERDA */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        {/* Título */}
        <div className="h-7 w-1/2 bg-gray-200 rounded mb-3"></div>

        {/* Linha: estrelas + badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
        </div>

        {/* Título Descrição */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-3"></div>

        {/* Texto de descrição */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gray-200 rounded mb-6"></div>

        {/* Título Avaliações */}
        <div className="h-6 w-28 bg-gray-200 rounded mb-4"></div>

        {/* Card de “sem avaliações ainda” */}
        <div className="w-full bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* COLUNA DIREITA (SIDEBAR) */}
      <aside className="w-full lg:w-80 bg-white rounded-lg shadow p-6">
        {/* Preço */}
        <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>

        {/* Preço por serviço */}
        <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>

        {/* Profissional */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>

          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Badge verificado */}
        <div className="h-5 w-24 bg-gray-200 rounded-full mb-6"></div>

        {/* Botão Agendar */}
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </aside>
    </div>
  );
}
