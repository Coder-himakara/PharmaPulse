import apiClient from './ApiClient';

// Add customer group
export const addCustomerGroups = (formData) =>
  apiClient.post('/customer-groups/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get all customer groups
export const getAllCustomerGroups = () =>
  apiClient.get('/customer-groups/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Get customer group by ID
export const getCustomerGroupsById = (id) =>
  apiClient.get(`/customer-groups/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

// Update customer group
export const updateCustomerGroups = (id, formData) =>
  apiClient.put(`/customer-groups/update/${id}`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Add customer
export const addCustomer = (formData) =>
  apiClient.post('/customers/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get customer  by ID
export const getCustomerById = (id) =>
  apiClient.get(`/customers/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get all customer
export const getAllCustomers = () =>
  apiClient.get('/customers/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Update customer
export const updateCustomers = (id, formData) =>
  apiClient.put(`/customers/update/${id}`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Add purchase group
export const addPurchaseGroups = (formData) =>
  apiClient.post('/purchase-groups/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get purchase groups  by ID
export const getPurchaseGroupsById = (id) =>
  apiClient.get(`/purchase-groups/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
// Get all purchase groups
export const getAllPurchaseGroups = () =>
  apiClient.get('/purchase-groups/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Update purchase groups
export const updatePurchaseGroups = (id, formData) =>
  apiClient.put(`/purchase-groups/update/${id}`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Add suppliers
export const addSuppliers = (formData) =>
  apiClient.post('/suppliers/add', formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get suppliers  by ID
export const getSuppliersById = (id) =>
  apiClient.get(`/suppliers/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

// Get all suppliers
export const getAllSuppliers = () =>
  apiClient.get('/suppliers/all', {
    headers: { 'Content-Type': 'application/json' },
  });

// Update suppliers
export const updateSuppliers = (id, formData) =>
  apiClient.put(`/suppliers/update/${id}`, formData, {
    headers: { 'Content-Type': 'application/json' },
  });

// Add products
export const addProducts = (formData, token = null) =>
  apiClient.post('/products/add', formData, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

// Get products  by ID
export const getProductsById = (id, token = null) =>
  apiClient.get(`/products/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

// Get all products
export const getAllProducts = (token = null) =>
  apiClient.get('/products/all', {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

// Update products
export const updateProducts = (id, formData, token = null) =>
  apiClient.put(`/products/update/${id}`, formData, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
