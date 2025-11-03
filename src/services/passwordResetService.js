import api from './api';

const passwordResetService = {
  // Solicitar recuperação de senha
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/password-reset/request', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao solicitar recuperação de senha' };
    }
  },

  // Validar token de recuperação
  validateToken: async (token) => {
    try {
      const response = await api.get(`/password-reset/validate/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao validar token' };
    }
  },

  // Resetar senha
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/password-reset/reset', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao resetar senha' };
    }
  }
};

export default passwordResetService;
