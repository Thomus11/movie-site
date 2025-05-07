import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
  return {};
};

export const getMovies = async (page = 1, perPage = 10) => {
  return axios.get(`${API_URL}/movies?page=${page}&per_page=${perPage}`, {
    headers: getAuthHeader()
  });
};

export const searchMovies = async (genre = '', title = '') => {
  return axios.get(`${API_URL}/movies/search?genre=${genre}&title=${title}`, {
    headers: getAuthHeader()
  });
};

export const getMovieDetails = async (id) => {
  return axios.get(`${API_URL}/movies/${id}`, {
    headers: getAuthHeader()
  });
};

// Admin only
export const createMovie = async (movieData) => {
  return axios.post(`${API_URL}/movies`, movieData, {
    headers: getAuthHeader()
  });
};

export const updateMovie = async (id, movieData) => {
  return axios.put(`${API_URL}/movies/${id}`, movieData, {
    headers: getAuthHeader()
  });
};

export const deleteMovie = async (id) => {
  return axios.delete(`${API_URL}/movies/${id}`, {
    headers: getAuthHeader()
  });
};