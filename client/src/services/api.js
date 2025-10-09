import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export const getAllCategories = () => api.get('/categories');
export const createCategory = (category) => api.post('/categories', category);
export const updateCategory = (id, category) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getAllTransactions = () => api.get('/transactions');
export const createTransaction = (transaction) => api.post('/transactions', transaction);
export const updateTransaction = (id, transaction) => api.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// Нет export default!