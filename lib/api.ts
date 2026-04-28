import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; studentId?: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users/all'),
};

// Blog API
export const blogAPI = {
  getPosts: (params?: { category?: string; published?: boolean; page?: number; limit?: number }) =>
    api.get('/blog', { params }),
  getPost: (id: string) => api.get(`/blog/${id}`),
  createPost: (data: any) => api.post('/blog', data),
  updatePost: (id: string, data: any) => api.put(`/blog/${id}`, data),
  deletePost: (id: string) => api.delete(`/blog/${id}`),
};

// Events API
export const eventsAPI = {
  getEvents: (params?: { published?: boolean; upcoming?: boolean; page?: number; limit?: number }) =>
    api.get('/events', { params }),
  getEvent: (id: string) => api.get(`/events/${id}`),
  createEvent: (data: any) => api.post('/events', data),
  updateEvent: (id: string, data: any) => api.put(`/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
  registerForEvent: (id: string) => api.post(`/events/${id}/register`),
};

// Gallery API
export const galleryAPI = {
  getGalleries: (params?: { published?: boolean; page?: number; limit?: number }) =>
    api.get('/gallery', { params }),
  getGallery: (id: string) => api.get(`/gallery/${id}`),
  createGallery: (data: any) => api.post('/gallery', data),
  updateGallery: (id: string, data: any) => api.put(`/gallery/${id}`, data),
  deleteGallery: (id: string) => api.delete(`/gallery/${id}`),
};

// Contact API
export const contactAPI = {
  getContactInfo: () => api.get('/contact/info'),
  createContact: (data: any) => api.post('/contact', data),
  getContacts: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/contact', { params }),
  getContact: (id: string) => api.get(`/contact/${id}`),
  updateContact: (id: string, data: any) => api.put(`/contact/${id}`, data),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

export default api;

