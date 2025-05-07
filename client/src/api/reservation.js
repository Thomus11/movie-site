import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
  return {};
};

export const createReservation = async (reservationData) => {
  return axios.post(`${API_URL}/reservations`, reservationData, {
    headers: getAuthHeader()
  });
};

export const getReservationsByUser = async (userId) => {
  return axios.get(`${API_URL}/reservations?user_id=${userId}`, {
    headers: getAuthHeader()
  });
};

export const cancelReservation = async (reservationId) => {
  return axios.delete(`${API_URL}/reservations/${reservationId}`, {
    headers: getAuthHeader()
  });
};

export const updateReservation = async (reservationId, updateData) => {
  return axios.put(`${API_URL}/reservations/${reservationId}`, updateData, {
    headers: getAuthHeader()
  });
};