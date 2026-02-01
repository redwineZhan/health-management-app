// API Service for Health Management App
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/api/auth/register', userData),
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  logout: () => apiClient.post('/api/auth/logout'),
  refresh: (refreshToken) => axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken }),
};

// Health Metrics API
export const healthMetricsAPI = {
  getAll: (params) => apiClient.get('/api/health', { params }),
  getById: (id) => apiClient.get(`/api/health/${id}`),
  create: (data) => apiClient.post('/api/health', data),
  update: (id, data) => apiClient.put(`/api/health/${id}`, data),
  delete: (id) => apiClient.delete(`/api/health/${id}`),
  getTrends: (params) => apiClient.get('/api/health/trends', { params }),
};

// Weight Loss API
export const weightLossAPI = {
  getAllPlans: () => apiClient.get('/api/weight-loss/plans'),
  getPlanById: (id) => apiClient.get(`/api/weight-loss/plans/${id}`),
  createPlan: (data) => apiClient.post('/api/weight-loss/plans', data),
  updatePlan: (id, data) => apiClient.put(`/api/weight-loss/plans/${id}`, data),
  deletePlan: (id) => apiClient.delete(`/api/weight-loss/plans/${id}`),
  
  getAllLogs: (params) => apiClient.get('/api/habits', { params }),
  getLogById: (id) => apiClient.get(`/api/habits/${id}`),
  createLog: (data) => apiClient.post('/api/habits', data),
  updateLog: (id, data) => apiClient.put(`/api/habits/${id}`, data),
  deleteLog: (id) => apiClient.delete(`/api/habits/${id}`),
};

// Community API
export const communityAPI = {
  getAll: () => apiClient.get('/api/communities'),
  getById: (id) => apiClient.get(`/api/communities/${id}`),
  create: (data) => apiClient.post('/api/communities', data),
  update: (id, data) => apiClient.put(`/api/communities/${id}`, data),
  delete: (id) => apiClient.delete(`/api/communities/${id}`),
  join: (id) => apiClient.post(`/api/communities/${id}/join`),
  leave: (id) => apiClient.delete(`/api/communities/${id}/leave`),
  
  getPosts: (params) => apiClient.get('/api/posts', { params }),
  getPostById: (id) => apiClient.get(`/api/posts/${id}`),
  createPost: (data) => apiClient.post('/api/posts', data),
  updatePost: (id, data) => apiClient.put(`/api/posts/${id}`, data),
  deletePost: (id) => apiClient.delete(`/api/posts/${id}`),
};

// Alerts API
export const alertsAPI = {
  getAll: () => apiClient.get('/api/alerts'),
  getLatest: (params) => apiClient.get('/api/alerts/latest', { params }),
};

export default apiClient;