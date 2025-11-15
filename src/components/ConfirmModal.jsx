import { X, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'red',
  loading = false, // Nova prop para controlar o loading
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  // Mapear cores para classes CSS
  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={loading ? undefined : onClose} // Impede fechar durante loading
        aria-hidden="true"
      />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-200 ease-out">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onClose}
          disabled={loading} // Desabilita durante loading
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading} // Desabilita durante loading
            className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading} // Desabilita durante loading
            className={`px-4 py-2 rounded-xl text-white transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses[confirmColor]}`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
