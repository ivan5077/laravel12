import api from '../utils/api';

// ------------------------------------------------------------------
// Products
// ------------------------------------------------------------------
export const getProducts = (params = {}) => api.get('/products', { params });

export const getProduct = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post('/products', data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ------------------------------------------------------------------
// Bulk delete
// ------------------------------------------------------------------
export const bulkDeleteProducts = (ids) =>
  api.post('/products/bulk-delete', { ids });

// ------------------------------------------------------------------
// Export to Excel (returns a Blob)
// ------------------------------------------------------------------
export const exportProducts = (params = {}) =>
  api.get('/products/export', { 
    params, 
    responseType: 'blob'  // This is correct
  });

// ------------------------------------------------------------------
// Categories (used for filter dropdown)
// ------------------------------------------------------------------
export const getCategories = () => api.get('/categories');