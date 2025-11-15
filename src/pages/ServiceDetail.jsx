import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, DollarSign, Calendar, ArrowLeft, User } from 'lucide-react';
import { getServiceAssessments } from '../services/assessmentService';
import { createAppointment } from '../services/appointmentService';
import { getServiceById } from '../services/serviceService';
import reviewService from '../services/reviewService';
import toast from 'react-hot-toast';
import ServiceDetailSkeleton from '../components/Skeleton/ServiceDetailSkeleton';

function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [rating, setRating] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    setLoading(true);
    try {
      // Buscar dados do serviço
      const serviceResult = await getServiceById(serviceId);
      if (serviceResult.success) {
        setService(serviceResult.data);
      } else {
        console.error(' Erro ao carregar serviço:', serviceResult.message);
        toast.error('Erro ao carregar detalhes do serviço');
      }

      // Buscar avaliações do serviço
      try {
        const reviewsResult = await reviewService.getServiceReviews(serviceId);
        if (reviewsResult.success && reviewsResult.data) {
          setAssessments(reviewsResult.data);
        }
      } catch (error) {
        setAssessments([]);
      }

      // Buscar média de avaliações
      try {
        const ratingResult = await reviewService.getServiceRating(serviceId);
        if (ratingResult.success && ratingResult.data) {
          setRating({
            average: parseFloat(ratingResult.data.average_rating) || 0,
            total: parseInt(ratingResult.data.total_reviews) || 0,
          });
        }
      } catch (error) {
        setRating({ average: 0, total: 0 });
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para converter data do formato ISO para dd/MM/yyyy HH:mm
  const formatDateForAPI = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    // Converter datas para o formato esperado pela API
    const formattedData = {
      startDate: formatDateForAPI(bookingData.startDate),
      endDate: formatDateForAPI(bookingData.endDate),
    };

    const result = await createAppointment(userId, serviceId, formattedData);
    if (result.success) {
      toast.success('Agendamento realizado com sucesso!');
      setShowBookingModal(false);
      navigate('/meus-agendamentos');
    } else {
      toast.error(`${result.message || 'Erro ao criar agendamento'}`);
    }
  };

  if (loading) {
    return (
      <div>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-violet-800 hover:text-violet-600">
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </header>
        <ServiceDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-violet-800 hover:text-violet-600">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{service?.title || 'Carregando...'}</h1>

              <div className="flex items-center gap-4 mb-6">
                {rating.total > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{rating.average.toFixed(1)}</span>
                    <span className="text-gray-600">
                      ({rating.total} {rating.total === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Star className="w-5 h-5" />
                    <span className="text-sm">Sem avaliações ainda</span>
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-sm ${service?.serviceStatus === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{service?.serviceStatus || 'Ativo'}</span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                <p className="text-gray-600 leading-relaxed">{service?.details || 'Sem descrição disponível.'}</p>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Avaliações</h2>
                {assessments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Este serviço ainda não foi avaliado</p>
                    <p className="text-sm text-gray-500 mt-1">Seja o primeiro a contratar e avaliar!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessments.map((review, index) => (
                      <div key={review.reviewId || index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 bg-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-violet-800" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-800">{review.clientName || review.client?.userName || 'Cliente'}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < (review.rating || review.score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{review.comment || review.comments || 'Sem comentário'}</p>
                            {review.createdAt && <p className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-violet-800">{service?.price ? service.price.toFixed(2) : '0.00'}</span>
                </div>
                <p className="text-gray-600 text-sm">Preço por serviço</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Profissional</h3>
                {service?.professional ? (
                  <div className="flex items-center gap-3">
                    {service.professional.profilePhoto ? (
                      <img src={service.professional.profilePhoto} alt={service.professional.userName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-violet-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {service.professional.userName
                            ?.split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'P'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{service.professional.userName}</p>
                      <p className="text-sm text-gray-600">{service.professional.profession || 'Profissional'}</p>
                      {service.professional.userType === 'Profissional' && <p className="text-xs text-green-600 mt-1">✓ Verificado</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-500">Carregando...</p>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setShowBookingModal(true)} disabled={!service} className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                Agendar Serviço
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl relative border border-gray-200" onClick={(e) => e.stopPropagation()}>
            {/* Botão Fechar */}
            <button type="button" onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" aria-label="Fechar">
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Agendar Serviço</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Data e Hora de Início</label>
                <input
                  type="datetime-local"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Data e Hora de Término</label>
                <input
                  type="datetime-local"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowBookingModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition font-semibold">
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetail;
