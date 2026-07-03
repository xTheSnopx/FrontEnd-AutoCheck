/**
 * Centralized API Configuration
 * Single source of truth for API URLs
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://192.168.40.19:5000/api',
  TIMEOUT: 15000,
};

export const getApiUrl = (endpoint) => {
  const base = API_CONFIG.BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

export default API_CONFIG;
