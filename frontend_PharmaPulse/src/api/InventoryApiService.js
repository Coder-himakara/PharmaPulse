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

export const getAllTrucks = () =>
  apiClient.get('/trucks/all', {
    headers: { 'Content-Type': 'application/json' },
  });

export const getTruckById = (truckId) =>
  apiClient.get(`/trucks/${truckId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

export const addTruck = (formData) =>
  apiClient.post('/trucks/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const updateTruck = (truckId, formData) =>
  apiClient.put(`/trucks/update/${truckId}`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });