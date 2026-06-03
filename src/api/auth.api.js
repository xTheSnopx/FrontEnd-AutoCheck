import apiClient from './client';
import { storage } from '../utils/storage';

export const authApi = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  refresh: async (refreshToken) => {
    const { data } = await apiClient.post('/auth/refresh', refreshToken);
    return data;
  },

  logout: async () => {
    const refreshToken = storage.getRefreshToken();
    if (refreshToken) {
      try { await apiClient.post('/auth/logout', refreshToken); } catch { /* silent */ }
    }
    storage.clearSession();
  },
};
