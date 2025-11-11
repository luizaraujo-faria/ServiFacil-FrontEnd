import api from './api';

export const getAllServices = async () => {
  try {
    const response = await api.get('/services/getall');
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar serviços',
    };
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar serviço',
    };
  }
};

export const filterServicesByCategory = async (category) => {
  try {
    const response = await api.get(`/services/filter/${category}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao filtrar serviços',
    };
  }
};
export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories/getall');
    return { success: true, data: response.data.data }; // conforme seu padrão
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar categorias',
    };
  }
};

export const createService = async (userId, serviceData) => {
  try {
    // Garantir que o preço está no formato correto (número com 2 casas decimais)
    const formattedData = {
      ...serviceData,
      price: typeof serviceData.price === 'string'
        ? parseFloat(serviceData.price)
        : serviceData.price
    };



    const response = await api.post(`/services/${userId}`, formattedData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro na API:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Erro ao criar serviço',
    };
  }
};

export const updateService = async (userId, serviceId, serviceData) => {
  try {
    const response = await api.patch(`/services/${userId}/${serviceId}`, serviceData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar serviço',
    };
  }
};

export const deleteService = async (userId, serviceId) => {
  try {
    const response = await api.delete(`/services/${userId}/${serviceId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao excluir serviço',
    };
  }
};
