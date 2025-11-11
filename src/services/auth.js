import api from './api';

export const login = async ({ email, password }) => {
  try {
    const response = await api.post('/users/login', {
      email,
      userPassword: password,
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      return { success: true, token: response.data.token };
    }
    return {
      success: false,
      message: response.data.message || 'Email ou senha incorretos'
    };
  } catch (error) {
    console.error('Erro no login:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Erro de conexão com o servidor',
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no registro:', error.response?.data);

    let errorMessage = 'Erro ao cadastrar usuário';

    // Verificar se é erro de email duplicado
    if (error.response?.data?.error?.includes('Duplicate entry') ||
      error.response?.data?.error?.includes('UK7jignkhopnaqmoi02hcyenquo')) {
      errorMessage = 'Este email já está cadastrado. Por favor, use outro email ou faça login.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);

    // Verificar se a resposta tem o formato esperado
    const userData = response.data.data || response.data;

    return { success: true, data: userData };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar usuário',
    };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.patch(`/users/${userId}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar usuário',
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};
