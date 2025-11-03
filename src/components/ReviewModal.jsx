import { useState } from 'react';
import { Star, X } from 'lucide-react';

const ReviewModal = ({ appointment, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Por favor, selecione uma avaliação');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(rating, comment);
            onClose();
        } catch (error) {
            alert(error.message || 'Erro ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Avaliar Serviço</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Informações do Agendamento */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Serviço</p>
                        <p className="font-semibold text-gray-800">{appointment.serviceName}</p>
                        <p className="text-sm text-gray-600 mt-2">Profissional</p>
                        <p className="font-semibold text-gray-800">{appointment.professionalName}</p>
                    </div>

                    {/* Rating com Estrelas */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Sua Avaliação *
                        </label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={40}
                                        className={`${star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-center mt-2 text-sm text-gray-600">
                                {rating === 1 && 'Muito Ruim'}
                                {rating === 2 && 'Ruim'}
                                {rating === 3 && 'Regular'}
                                {rating === 4 && 'Bom'}
                                {rating === 5 && 'Excelente'}
                            </p>
                        )}
                    </div>

                    {/* Comentário */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comentário (opcional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Conte como foi sua experiência..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || rating === 0}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
