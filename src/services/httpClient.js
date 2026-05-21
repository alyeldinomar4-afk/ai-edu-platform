import axios from 'axios';

// Base URL provided by the backend team (from README.md)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the Auth token when available
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_edu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Extract data automatically or handle global errors
httpClient.interceptors.response.use(
  (response) => {
    // The backend usually returns { message, data, metadata }
    // We return the full data object so services can extract `data` or `metadata` as needed
    return response.data;
  },
  (error) => {
    // Handle unauthorized globally if needed
    if (error.response?.status === 401) {
      // Uncomment this later when Auth is fully integrated
      // localStorage.removeItem('ai_edu_token');
      // localStorage.removeItem('ai_edu_user');
      // window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ 
        message, 
        status: error.response?.status, 
        data: error.response?.data 
    });
  }
);

export default httpClient;
