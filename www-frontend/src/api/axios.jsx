// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Ajusta la URL según tu backend
  withCredentials: true, // Para manejar cookies
});

export default api;
