/* eslint-disable prettier/prettier */
import apiClient from './ApiClient';

// Helper function for debugging
const logRequest = async (requestPromise, requestName) => {
  console.log(`Starting ${requestName}...`);
  try {
    const response = await requestPromise;
    console.log(`${requestName} successful:`, response.data);
    return response;
  } catch (error) {
    console.error(`${requestName} failed:`, error.response?.data || error.message);
    throw error;
  }
};

// REMOVE the /api prefix since it's already in the baseURL
// Get all trucks
export const getAllTrucks = () => 
  logRequest(
    apiClient.get('/trucks/all'), 
    'getAllTrucks'
  );

// Get truck by ID
export const getTruckById = (truckId) =>
  logRequest(
    apiClient.get(`/trucks/${truckId}`),
    `getTruckById(${truckId})`
  );

// Add a new truck
export const addTruck = (truckData) => {
  console.log('Sending truck data to backend:', truckData);
  return logRequest(
    apiClient.post('/trucks/add', truckData),
    'addTruck'
  );
};

// Update an existing truck
export const updateTruck = (truckId, truckData) =>
  logRequest(
    apiClient.put(`/trucks/update/${truckId}`, truckData),
    `updateTruck(${truckId})`
  );

// Check available space in a truck
export const getTruckAvailableSpace = (truckId) =>
  logRequest(
    apiClient.get(`/trucks/${truckId}/available-space`),
    `getTruckAvailableSpace(${truckId})`
  );