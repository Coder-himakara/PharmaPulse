import apiClient from './ApiClient';

export const getAllInventoryLocations = (formData) =>
  apiClient.get('/inventory-location/all', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const getInventoryDetails = (formData) =>
  apiClient.get('/inventory/details', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const submitStockTransfer = (formData) =>
  apiClient.post('/stock-transfer/process', formData, {
    headers: { 'Content-Type': 'application/json' },
  });
