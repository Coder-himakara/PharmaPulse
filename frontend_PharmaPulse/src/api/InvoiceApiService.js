// src/api/InvoiceApiService.js
import apiClient from './ApiClient';

// Enhanced error handling with more specific error messages
export const getAllPurchaseInvoices = async () => {
  try {
    console.log('Calling API endpoint: /purchase-invoices/all');
    const response = await apiClient.get('/purchase-invoices/all', {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Raw response from getAllPurchaseInvoices:', response);
    return response;
  } catch (error) {
    console.error('Error fetching purchase invoices:', error);
    // Create a more user-friendly error object
    const userError = {
      message: 'Failed to fetch purchase invoices',
      details: error.response?.data?.details || error.message,
      status: error.response?.status || 500,
    };
    throw userError;
  }
};

// Get purchase invoice by ID with error handling
export const getPurchaseInvoiceById = async (invoiceId) => {
  try {
    console.log(`Calling API endpoint: /purchase-invoices/${invoiceId}`);
    const response = await apiClient.get(`/purchase-invoices/${invoiceId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(
      `Raw response from getPurchaseInvoiceById(${invoiceId}):`,
      response,
    );
    return response;
  } catch (error) {
    console.error(`Error fetching purchase invoice ${invoiceId}:`, error);
    throw error;
  }
};

// Add a purchase invoice
export const addPurchaseInvoice = (invoiceData) =>
  apiClient.post('/purchase-invoices/add', invoiceData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Update a purchase invoice (to be implemented when API is available)
export const updatePurchaseInvoice = (invoiceId, invoiceData) =>
  apiClient.put(`/purchase-invoices/${invoiceId}`, invoiceData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Delete a purchase invoice (to be implemented when API is available)
export const deletePurchaseInvoice = (invoiceId) =>
  apiClient.delete(`/purchase-invoices/${invoiceId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get all suppliers
export const getAllSuppliers = () =>
  apiClient.get('/suppliers/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Get all products
export const getAllProducts = () =>
  apiClient.get('/products/all', {
    headers: { 'Content-Type': 'application/json' },
  });
