import api from './api';

export const createAppointment = async (userId, serviceId, appointmentData) => {
  try {
    const response = await api.post(`/appointments/${userId}/${serviceId}`, appointmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao criar agendamento',
    };
  }
};

export const getUserAppointments = async (userId, status) => {
  try {
    const response = await api.get(`/appointments/user/${userId}/${status}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    // Se for 404, significa que não há agendamentos (não é erro)
    if (error.response?.status === 404) {
      return { success: true, data: [] };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar agendamentos',
    };
  }
};

export const getServiceAppointments = async (userId, serviceId, status) => {
  try {
    const response = await api.get(`/appointments/service/${userId}/${serviceId}/${status}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    // Se for 404, significa que não há agendamentos (não é erro)
    if (error.response?.status === 404) {
      return { success: true, data: [] };
    }
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar agendamentos do serviço',
    };
  }
};

export const cancelAppointment = async (userId, appointmentId) => {
  try {
    const response = await api.patch(`/appointments/cancel/${userId}/${appointmentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao cancelar agendamento',
    };
  }
};

export const concludeAppointment = async (userId, appointmentId) => {
  try {
    const response = await api.patch(`/appointments/conclude/${userId}/${appointmentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao concluir agendamento',
    };
  }
};
