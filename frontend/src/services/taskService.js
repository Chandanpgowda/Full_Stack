import apiClient from './api';

export const taskService = {
  /**
   * Fetch all tasks with optional filters (search, status, priority, assignedTo, page, limit)
   */
  async getTasks(params = {}) {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  /**
   * Get single task by ID
   */
  async getTaskById(id) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(data) {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  /**
   * Update an existing task by ID
   */
  async updateTask(id, data) {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete task by ID
   */
  async deleteTask(id) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Get all tasks assigned to a specific employee
   */
  async getEmployeeTasks(employeeId) {
    const response = await apiClient.get(`/employees/${employeeId}/tasks`);
    return response.data;
  }
};
