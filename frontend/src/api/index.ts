import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  register: async (email: string, pass: string) => {
    const response = await apiClient.post('/auth/register', { email, pass });
    return response.data;
  },

  login: async (email: string, pass: string) => {
    const response = await apiClient.post('/auth/login', { email, pass });
    return response.data;
  },

  analyzeImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/cards/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  saveCard: async (cardData: { 
    imageUrl: string; 
    wordEn: string; 
    wordRu: string; 
    rawData: Record<string, unknown>; 
    isPublic?: boolean; 
  }) => {
    const response = await apiClient.post('/cards/save', cardData);
    return response.data;
  },

  getDictionary: async () => {
    const response = await apiClient.get('/cards/dictionary');
    return response.data;
  },

  getCardsToReview: async () => {
    const response = await apiClient.get('/cards/review');
    return response.data;
  },

  reviewCard: async (userCardId: number, quality: number) => {
    const response = await apiClient.post(`/cards/${userCardId}/review`, { quality });
    return response.data;
  },

  deleteCard: async (cardId: number) => {
    const response = await apiClient.delete(`/cards/${cardId}`);
    return response.data;
  },

  getFeed: async () => {
    const response = await apiClient.get('/cards/feed');
    return response.data;
  },

  importCard: async (feedCardId: number) => {
    const response = await apiClient.post(`/cards/feed/${feedCardId}/save`);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (nickname: string, file?: File, newPassword?: string) => {
    const formData = new FormData();
    if (nickname) formData.append('nickname', nickname);
    if (file) formData.append('file', file);
    if (newPassword) formData.append('newPassword', newPassword);

    const response = await apiClient.patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};