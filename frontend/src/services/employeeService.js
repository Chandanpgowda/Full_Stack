import apiClient from './api';

export const employeeService = {
  /**
   * Fetch employees with optional query params (search, department, pagination, sorting)
   */
  async getEmployees(params = {}) {
    const response = await apiClient.get('/employees', { params });
    return response.data;
  },

  /**
   * Fetch a single employee by their ID
   */
  async getEmployeeById(id) {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Create a new employee
   */
  async createEmployee(data) {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  /**
   * Update an existing employee by ID
   */
  async updateEmployee(id, data) {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },

  /**
   * Delete an employee by ID
   */
  async deleteEmployee(id) {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },

  /**
   * Check backend and database health status
   */
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  }
};
