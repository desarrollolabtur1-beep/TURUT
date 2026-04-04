import axios from 'axios';

// API Base URL — uses local dev server or production
const API_BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://api.turut.online/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from storage
      // For web, we can use localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      // For React Native, we would use AsyncStorage
      // In a real implementation, you would import and use AsyncStorage

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // If token retrieval fails, continue without token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear token and redirect to login (implement based on your navigation setup)
      // For web
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // In a real app, you would redirect to login page
        // window.location.href = '/login';
      }
      // For React Native, you would use navigation prop
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth service functions
export const authService = {
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  getProfile: () => api.get('/auth/me'),
};

// Experience service functions
export const experienceService = {
  getAll: () => api.get('/experiences'),
  getFeatured: () => api.get('/experiences/featured'),
  getById: (id: string) => api.get(`/experiences/${id}`),
  create: (experienceData: any) => api.post('/experiences', experienceData),
  update: (id: string, experienceData: any) =>
    api.put(`/experiences/${id}`, experienceData),
  delete: (id: string) => api.delete(`/experiences/${id}`),
};

// Booking service functions
export const bookingService = {
  getMyBookings: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (bookingData: any) => api.post('/bookings', bookingData),
  update: (id: string, bookingData: any) =>
    api.put(`/bookings/${id}`, bookingData),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};
