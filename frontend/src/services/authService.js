import apiClient from './api';

export const authService = {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const response = await apiClient.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Google OAuth login / registration
   */
  async googleAuth(payload) {
    const response = await apiClient.post('/auth/google', payload);
    return response.data;
  },

  /**
   * Verify token and fetch current user profile
   */
  async getMe() {
    const token = localStorage.getItem('ems_token');
    if (!token) return null;
    const response = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
