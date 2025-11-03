import api from './api';

export const createAssessment = async (userId, serviceId, assessmentData) => {
  try {
    const response = await api.post(`/assessments/${userId}/${serviceId}`, assessmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar avaliação',
    };
  }
};

export const getServiceAssessments = async (userId, serviceId) => {
  try {
    const response = await api.get(`/assessments/service/${userId}/${serviceId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar avaliações',
    };
  }
};

export const updateAssessment = async (userId, serviceId, assessmentId, assessmentData) => {
  try {
    const response = await api.patch(`/assessments/${userId}/${serviceId}/${assessmentId}`, assessmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao atualizar avaliação',
    };
  }
};

export const deleteAssessment = async (userId, serviceId, assessmentId) => {
  try {
    const response = await api.delete(`/assessments/${userId}/${serviceId}/${assessmentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao excluir avaliação',
    };
  }
};
