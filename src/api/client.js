import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===== Instancia axios centralizada =====
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ===== Interceptor de request: inyecta el JWT =====
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== Interceptor de response: maneja 401 con refresh token =====
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          refreshQueue.push({ resolve, reject }),
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, refreshToken, {
          headers: { 'Content-Type': 'application/json' },
        });

        storage.saveSession(data, !!localStorage.getItem('authToken'));
        processQueue(null, data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        storage.clearSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
