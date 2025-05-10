// src/api.js
import axios from 'axios';
import { API_BASE_URL } from './config';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
