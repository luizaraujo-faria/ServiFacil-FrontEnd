import api from './api';

const reviewService = {
  // Criar avaliação
  createReview: async (appointmentId, clientId, rating, comment) => {
    try {
      const response = await api.post('/reviews', {
        appointmentId,
        clientId,
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar avaliação' };
    }
  },

  // Buscar avaliações do profissional
  getProfessionalReviews: async (professionalId) => {
    try {
      const response = await api.get(`/reviews/professional/${professionalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar avaliações' };
    }
  },

  // Buscar avaliações de um serviço
  getServiceReviews: async (serviceId) => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar avaliações do serviço' };
    }
  },

  // Buscar média de avaliações de um serviço
  getServiceRating: async (serviceId) => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}/rating`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar média de avaliações' };
    }
  },

  // Verificar se pode avaliar
  canReviewAppointment: async (appointmentId, clientId) => {
    try {
      const response = await api.get(`/reviews/can-review/${appointmentId}/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao verificar permissão' };
    }
  }
};

export default reviewService;
