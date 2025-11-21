// src/api/categoryApi.js
import api from "./axios.js"; // Instance axios chung

// Lấy tất cả danh mục (Public)
export const getCategories = () => {
  return api.get("/categories");
};

// Tạo danh mục mới (Admin)
export const createCategory = (categoryData) => {
  // POST /api/categories
  return api.post("/categories", categoryData); 
};

// Cập nhật danh mục (Admin)
export const updateCategory = (id, categoryData) => {
  // PUT /api/categories/:id
  return api.put(`/categories/${id}`, categoryData);
};

// Xóa danh mục (Admin)
export const deleteCategory = (id) => {
  // DELETE /api/categories/:id
  return api.delete(`/categories/${id}`);
};