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

// Get purchase invoice by ID with enhanced error handling for 404 errors
export const getPurchaseInvoiceById = async (invoiceId) => {
  try {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    console.log(`Calling API endpoint: /purchase-invoices/${invoiceId}`);
    const response = await apiClient.get(`/purchase-invoices/${invoiceId}`, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: function (status) {
        // Consider only 5xx errors as exceptions, handle 404 separately
        return status < 500;
      },
    });

    // Handle 404 explicitly
    if (response.status === 404) {
      console.warn(`Invoice with ID ${invoiceId} not found`);
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    console.log(
      `Raw response from getPurchaseInvoiceById(${invoiceId}):`,
      response,
    );
    return response;
  } catch (error) {
    // Check if it's an axios error with a response
    if (error.response) {
      console.error(`Error fetching purchase invoice ${invoiceId}:`, error);
      throw {
        message: `Failed to fetch invoice #${invoiceId}`,
        details: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error(`No response received for invoice ${invoiceId}:`, error);
      throw {
        message: 'No response from server',
        details: 'The request was made but no response was received',
        status: 0,
      };
    } else {
      // Something else caused the error
      console.error(`Error with invoice ${invoiceId} request setup:`, error);
      throw {
        message: error.message || 'Unknown error occurred',
        details: 'Error occurred while setting up the request',
        status: 0,
      };
    }
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

// Get supplier details by ID - updated to match EmployeeApiService implementation
export const getSupplierById = async (supplierId) => {
  try {
    if (!supplierId) {
      throw new Error('Supplier ID is required');
    }

    console.log(`Fetching supplier details for ID: ${supplierId}`);
    // Using the correct API endpoint consistent with EmployeeApiService
    const response = await apiClient.get(`/suppliers/${supplierId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`Supplier details response for ID ${supplierId}:`, response);
    return response;
  } catch (error) {
    console.error(
      `Error fetching supplier details for ID ${supplierId}:`,
      error,
    );
    // Create a user-friendly error
    const userError = {
      message: 'Failed to fetch supplier details',
      details: error.response?.data?.details || error.message,
      status: error.response?.status || 500,
    };
    throw userError;
  }
};

// Get all products
export const getAllProducts = () =>
  apiClient.get('/products/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Get purchase invoice details including line items
export const getPurchaseInvoiceDetails = async (invoiceId) => {
  try {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    console.log(`Fetching invoice details for ID: ${invoiceId}`);
    const response = await apiClient.get(`/purchase-invoices/${invoiceId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Invoice details response:', response);
    return response;
  } catch (error) {
    console.error(`Error fetching invoice details for ID ${invoiceId}:`, error);
    throw {
      message: 'Failed to fetch invoice details',
      details: error.response?.data?.details || error.message,
      status: error.response?.status || 500,
    };
  }
};
