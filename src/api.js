import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('greenBasketToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('greenBasketToken');
      localStorage.removeItem('greenBasketUser');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
};

export const basketsAPI = {
  getAll: () => api.get('/baskets'),
  getById: (id) => api.get(`/baskets/${id}`),
  create: (data) => api.post('/baskets', data),
  update: (id, data) => api.put(`/baskets/${id}`, data),
  delete: (id) => api.delete(`/baskets/${id}`),
};

export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

export const contactsAPI = {
  getAll: () => api.get('/contacts'),
  send: (data) => api.post('/contacts', data),
};

export const subscribersAPI = {
  subscribe: (email) => api.post('/subscribers', { email }),
};

export default api;
