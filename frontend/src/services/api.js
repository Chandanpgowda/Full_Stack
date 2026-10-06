import axios from 'axios';

// Base API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically add Authorization token header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ems_token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors uniformly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with non-2xx status code
      customMessage =
        error.response.data?.message ||
        (Array.isArray(error.response.data?.errors)
          ? error.response.data.errors.join(', ')
          : error.response.statusText) ||
        customMessage;
    } else if (error.request) {
      // Request was made but no response received (server down / network issue)
      customMessage = 'Unable to connect to the backend server. Please verify the server is running.';
    }

    const enhancedError = new Error(customMessage);
    enhancedError.statusCode = error.response?.status;
    enhancedError.data = error.response?.data;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
