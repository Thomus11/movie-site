import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
  return {};
};

export const getAdminReport = async () => {
  return axios.get(`${API_URL}/admin/report`, {
    headers: getAuthHeader()
  });
};

export const getAllReservations = async () => {
  return axios.get(`${API_URL}/admin/reservations`, {
    headers: getAuthHeader()
  });
};

export const getAdminReferences = async (adminId) => {
  return axios.get(`${API_URL}/admin/${adminId}/references`, {
    headers: getAuthHeader()
  });
};

export const promoteUser = async (userId) => {
  return axios.post(`${API_URL}/users/promote/${userId}`, {}, {
    headers: getAuthHeader()
  });
};

export const getAllUsers = async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  };