import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Add a response interceptor for production quality error logging
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors globally during development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
