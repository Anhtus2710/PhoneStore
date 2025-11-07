import api from "./axios";

export const getStats = () => api.get("/admin/stats");

export const getAdminProducts = () => api.get("/admin/products");

export const createProduct = (productData) =>
  api.post("/admin/products", productData);

export const updateProduct = (id, productData) =>
  api.put(`/admin/products/${id}`, productData);

export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

export const getUsers = () => api.get("/admin/users");

export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData);

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getOrders = () => api.get("/orders");

export const searchOrders = (searchTerm) =>
  api.get(`/admin/orders/search?q=${encodeURIComponent(searchTerm)}`);

export const updateOrderStatus = (id, statusData) =>
  api.put(`/admin/orders/${id}/status`, statusData);

export const setProductFeatured = (id, featured) =>
  api.put(`/products/${id}/featured`, { featured });

export const getFeaturedProducts = (limit = 4) =>
  api.get(`/products/featured?limit=${limit}`);
