import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.access_token) {
    return { 
      Authorization: 'Bearer ' + user.access_token,
      'Content-Type': 'multipart/form-data'
    };
  }
  return {};
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_URL}/upload-poster`, formData, {
    headers: getAuthHeader()
  });
};