export const Loading = ({ size = "medium", text = "Carregando..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-green-500 rounded-full animate-spin`} />
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export const ButtonLoading = ({ loading, children, className = "", ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled} className={className}>
      {loading ? (
        <div className="flex items-center justify-center gap-2 min-h-[48px]">
          <div className="w-[18px] h-[18px] border-2 border-transparent border-t-current rounded-full animate-spin flex-shrink-0" />
          <span className="text-base font-semibold">Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export const PageLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <Loading size="large" text="Carregando página..." />
    </div>
  );
};

export default Loading;


