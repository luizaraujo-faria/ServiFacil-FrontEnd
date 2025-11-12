export const ProfileSkeleton = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-300 h-36 relative"></div>

            <div className="px-4 sm:px-8 pb-8 sm:pb-10 -mt-16 animate-pulse">
              {/* Header responsivo */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                  {/* Foto de perfil skeleton */}
                  <div className="flex justify-center sm:justify-start">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-400"></div>
                  </div>

                  {/* Informações do usuário skeleton */}
                  <div className="text-center sm:text-left space-y-2">
                    <div className="h-6 w-40 bg-gray-300 rounded mx-auto sm:mx-0"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto sm:mx-0"></div>
                  </div>
                </div>

                {/* Botão skeleton */}
                <div className="flex justify-center sm:justify-start">
                  <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
                </div>
              </div>

              {/* Campos de informação skeleton */}
              <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded-md"></div>
                  </div>
                ))}
              </div>

              {/* Seção de endereço skeleton */}
              <div className="mt-8 sm:mt-10">
                <div className="h-5 w-24 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={`addr-${i}`} className="flex flex-col gap-2">
                      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                      <div className="h-10 bg-gray-200 rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
