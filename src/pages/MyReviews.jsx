import { useState, useEffect } from 'react';
import { Star, Calendar, User } from 'lucide-react';
import UserNavigation from '../components/UserNavigation';
import reviewService from '../services/reviewService';
import ReviewsSkeleton from '../components/Skeleton/ReviewsSkeleton';

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const result = await reviewService.getProfessionalReviews(userId);

      if (result.success) {
        const reviewsData = result.data;
        setReviews(reviewsData);

        // Calcular estatísticas
        const total = reviewsData.length;
        const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
        const avg = total > 0 ? (sum / total).toFixed(1) : 0;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach((r) => {
          distribution[r.rating]++;
        });

        setStats({
          totalReviews: total,
          averageRating: avg,
          ratingDistribution: distribution,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={20} className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Minhas Avaliações</h1>

        {loading ? (
          <ReviewsSkeleton />
        ) : (
          <>
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Média Geral */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Avaliação Média</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-800">{stats.averageRating}</span>
                    <Star className="fill-yellow-400 text-yellow-400" size={32} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {stats.totalReviews} {stats.totalReviews === 1 ? 'avaliação' : 'avaliações'}
                  </p>
                </div>
              </div>

              {/* Total de Avaliações */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Total de Avaliações</p>
                  <p className="text-4xl font-bold text-blue-600 mb-2">{stats.totalReviews}</p>
                  <p className="text-sm text-gray-500">Recebidas</p>
                </div>
              </div>

              {/* Distribuição */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-3 text-center">Distribuição</p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{
                            width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{stats.ratingDistribution[rating]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Avaliações */}
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Nenhuma avaliação recebida ainda</p>
                <p className="text-gray-500 text-sm mt-2">As avaliações dos seus clientes aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.reviewId} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header da Avaliação */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-gray-400" />
                              <span className="font-semibold text-gray-800">{review.clientName}</span>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>

                        {/* Serviço */}
                        <div className="mb-3">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{review.serviceName}</span>
                        </div>

                        {/* Comentário */}
                        {review.comment && (
                          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 italic">"{review.comment}"</p>
                          </div>
                        )}

                        {/* Data do Agendamento */}
                        {review.appointmentDate && (
                          <div className="mt-3 text-sm text-gray-500">
                            Agendamento: {review.appointmentDate} às {review.appointmentTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyReviews;
