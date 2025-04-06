/* eslint-disable prettier/prettier */
import apiClient from './ApiClient';


export const getAllInventoryLocations = () =>
  apiClient.get('/inventory-location/all', {
    headers: { 'Content-Type': 'application/json' },
  });

export const getInventoryDetails = () =>
  apiClient.get('/inventory/details', {
    headers: { 'Content-Type': 'application/json' },
  });

export const submitStockTransfer = (formData) =>
  apiClient.post('/stock-transfer/process', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllBatchInventories = () =>
  apiClient.get('/batch-inventory/all', {
    headers: { 'Content-Type': 'application/json' },
  });

export const getProductById = (id) =>
  apiClient.get(`/products/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

 