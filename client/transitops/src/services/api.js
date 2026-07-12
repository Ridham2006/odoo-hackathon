import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent infinite loops when multiple 401s fire
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-logout for login/signup endpoints - let the component handle errors
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    
    if (error.response?.status === 401 && !isRedirecting && !isAuthEndpoint) {
      isRedirecting = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event for React to handle gracefully
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const driverAPI = {
  getAll: (params) => api.get('/drivers', { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
};

export const tripAPI = {
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  dispatch: (id) => api.post(`/trips/${id}/dispatch`),
  complete: (id) => api.post(`/trips/${id}/complete`),
  cancel: (id) => api.post(`/trips/${id}/cancel`),
};

export const vehicleAPI = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export const expenseAPI = {
  getFuelLogs: (params) => api.get('/expenses/fuel', { params }),
  addFuelLog: (data) => api.post('/expenses/fuel', data),
  getAll: (params) => api.get('/expenses', { params }),
  create: (data) => api.post('/expenses', data),
};

export const maintenanceAPI = {
  getAll: (params) => api.get('/maintenance', { params }),
  create: (data) => api.post('/maintenance', data),
  close: (id) => api.post(`/maintenance/${id}/close`),
};

export const analyticsAPI = {
  getDashboardKPIs: () => api.get('/analytics/dashboard'),
  getAnalytics: () => api.get('/analytics'),
  getVehicleStatus: () => api.get('/analytics/vehicle-status'),
  getTripStatus: () => api.get('/analytics/trip-status'),
  getMonthlyFuel: () => api.get('/analytics/monthly-fuel'),
  getDriverStatus: () => api.get('/analytics/driver-status'),
  getExpenseBreakdown: () => api.get('/analytics/expense-breakdown'),
};

export const apiClient = api;

export default api;
