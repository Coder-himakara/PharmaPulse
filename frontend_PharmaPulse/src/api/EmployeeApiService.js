import apiClient from './ApiClient';

export const addCustomerGroups = (formData) =>
  apiClient.post('/customer-groups/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllCustomerGroups = () =>
  apiClient.get('/customer-groups/all', {
    headers: { 'Content-Type': 'application/json' },
  });

export const addCustomer = (formData) =>
  apiClient.post('/customers/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const addPurchaseGroups = (formData) =>
  apiClient.post('/purchase-groups/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllPurchaseGroups = () =>
  apiClient.get('/purchase-groups/all', { 
    headers: { 'Content-Type': 'application/json' },
  });

export const addSuppliers = (formData) =>
  apiClient.post('/suppliers/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });