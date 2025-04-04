import apiClient from './ApiClient';

export const getAllInventoryLocations = (formData) =>
  apiClient.get('/inventory-location//all', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllInventories = (formData) =>
  apiClient.get('/inventory/all', formData, {
    headers: { 'Content-Type': 'application/json' },
  });
