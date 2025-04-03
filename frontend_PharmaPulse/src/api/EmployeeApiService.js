import apiClient from './ApiClient';

export const addPurchaseInvoice = (formData) =>
  apiClient.post('/purchase-invoices/add', formData, {
    headers: {
      'Content-Type': 'form-data',
    },
  });
