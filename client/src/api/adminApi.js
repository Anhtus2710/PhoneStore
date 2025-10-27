import api from "./axios"; // Import instance axios đã cấu hình

/** Lấy dữ liệu thống kê cho trang Dashboard */
export const getStats = () => api.get("/admin/stats");

/** Lấy danh sách tất cả sản phẩm (cho trang quản lý) */
export const getAdminProducts = () => api.get("/admin/products");

/** Tạo sản phẩm mới (dữ liệu gửi lên là FormData) */
export const createProduct = (productData) =>
  api.post("/admin/products", productData);

/** Cập nhật sản phẩm (dữ liệu gửi lên là FormData nếu có ảnh, hoặc object nếu không) */
export const updateProduct = (id, productData) =>
  api.put(`/admin/products/${id}`, productData);

/** Xóa sản phẩm theo ID */
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

/** Lấy danh sách tất cả người dùng */
export const getUsers = () => api.get("/admin/users");

/** Cập nhật thông tin người dùng (thường là chỉ cập nhật role) */
export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData);

/** Xóa người dùng theo ID */
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

/** Lấy danh sách tất cả đơn hàng */
export const getOrders = () => api.get("/orders");

/** Cập nhật trạng thái đơn hàng theo ID */
export const updateOrderStatus = (id, statusData) =>
  api.put(`/admin/orders/${id}/status`, statusData);
