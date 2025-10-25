import api from "./axios";

// Thống kê
export const getStats = () => api.get("/admin/stats");

// Quản lý sản phẩm (Admin)
export const getAdminProducts = () => api.get("/admin/products");
export const createProduct = (productData) =>
  api.post("/admin/products", productData);
export const updateProduct = (id, productData) =>
  api.put(`/admin/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// Quản lý người dùng
export const getUsers = () => api.get("/admin/users");
export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

// Quản lý đơn hàng (Giả định endpoint)
export const getOrders = () => api.get("/admin/orders");
// LƯU Ý: Đảm bảo bạn đã thêm "/admin/orders" vào adminRoutes.js ở backend
