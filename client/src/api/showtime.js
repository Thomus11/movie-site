import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
  return {};
};

export const getShowtimes = async (movieId) => {
  return axios.get(`${API_URL}/showtimes/search?movie_id=${movieId}`, {
    headers: getAuthHeader()
  });
};

export const getSeatsForShowtime = async (showtimeId) => {
  return axios.get(`${API_URL}/showtimes/${showtimeId}/seats`, {
    headers: getAuthHeader()
  });
};

export const createShowtime = async (showtimeData) => {
  return axios.post(`${API_URL}/showtimes`, showtimeData, {
    headers: getAuthHeader()
  });
};

export const updateShowtime = async (showtimeId, showtimeData) => {
  return axios.put(`${API_URL}/showtimes/${showtimeId}`, showtimeData, {
    headers: getAuthHeader()
  });
};