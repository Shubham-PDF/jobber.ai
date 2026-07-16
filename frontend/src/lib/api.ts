import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let tokenGetter: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
};

// Interceptor to inject JWT token into requests
api.interceptors.request.use(
  async (config) => {
    if (tokenGetter && config.headers) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Failed to get auth token', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token expiration (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Download a file from an authenticated API endpoint.
 * Uses axios (with the Clerk JWT) instead of a plain <a href>,
 * which can't send the Authorization header.
 */
export const authenticatedDownload = async (path: string, filename: string) => {
  const response = await api.get(path, { responseType: 'blob' });
  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;
