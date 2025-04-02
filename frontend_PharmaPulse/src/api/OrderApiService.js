import apiClient from './ApiClient';

export const createOrder = (orderData) => apiClient.post('/orders', orderData);
