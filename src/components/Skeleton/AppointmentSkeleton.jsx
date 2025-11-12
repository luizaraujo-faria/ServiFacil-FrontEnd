// src/components/AppointmentSkeleton.jsx
function AppointmentSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Esquerda: informações do serviço */}
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* título */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-24 mt-3"></div> {/* status */}
            </div>

            {/* Direita: botão fake */}
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppointmentSkeleton;
