import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createAssessment } from '../services/assessmentService';
import { Star, ArrowLeft } from 'lucide-react';

function CreateAssessment() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Por favor, selecione uma avaliação');
            return;
        }

        setLoading(true);
        const userId = localStorage.getItem('userId');

        const result = await createAssessment(userId, serviceId, {
            score: rating,
            comments: comment,
        });

        setLoading(false);

        if (result.success) {
            alert('Avaliação enviada com sucesso!');
            navigate('/meus-agendamentos');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/meus-agendamentos')}
                        className="flex items-center gap-2 text-violet-800 hover:text-violet-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Avaliar Serviço</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Como foi sua experiência?</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {rating === 1 && 'Muito ruim'}
                                    {rating === 2 && 'Ruim'}
                                    {rating === 3 && 'Regular'}
                                    {rating === 4 && 'Bom'}
                                    {rating === 5 && 'Excelente'}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium mb-1">
                                Comentário (opcional)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                maxLength={200}
                                placeholder="Conte-nos sobre sua experiência..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <p className="mt-1 text-sm text-gray-500">{comment.length}/200 caracteres</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || rating === 0}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Enviar Avaliação'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAssessment;
