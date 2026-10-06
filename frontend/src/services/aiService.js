import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const aiService = {
  /**
   * Get client-stored Gemini API key if present
   */
  getClientKey() {
    return localStorage.getItem('ems_gemini_api_key') || '';
  },

  /**
   * Store or remove client Gemini API key
   */
  setClientKey(key) {
    if (key && key.trim()) {
      localStorage.setItem('ems_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('ems_gemini_api_key');
    }
  },

  /**
   * Check if backend has Gemini API key configured
   */
  async getStatus() {
    try {
      const res = await axios.get(`${API_BASE}/ai/status`, { timeout: 8000 });
      return res.data;
    } catch {
      return { hasServerKey: false, recommendedModel: 'gemini-2.5-flash' };
    }
  },

  /**
   * Send prompt to Gemini AI assistant
   */
  async sendMessage({ prompt, conversationHistory = [], contextData = {} }) {
    const clientApiKey = this.getClientKey();
    const res = await axios.post(
      `${API_BASE}/ai/chat`,
      {
        prompt,
        conversationHistory,
        contextData,
        clientApiKey: clientApiKey || undefined
      },
      {
        timeout: 45000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  }
};
