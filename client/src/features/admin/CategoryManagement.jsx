// src/features/admin/CategoryManagement.jsx
import React, { useEffect, useState } from "react";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../api/categoryApi";
import { useAuth } from "../../hooks/useAuth"; // Để kiểm tra (nếu cần)

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho form thêm mới
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tải danh sách
  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      setError("Không thể tải danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Xử lý Thêm mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createCategory({ name: newCategoryName });
      setNewCategoryName(""); // Reset form
      await loadCategories(); // Tải lại danh sách
    } catch (err) {
      setError(err.response?.data?.message || "Tạo danh mục thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Sửa
  const handleUpdate = async (id, oldName) => {
    const newName = window.prompt("Nhập tên mới cho danh mục:", oldName);
    
    if (newName && newName.trim() && newName !== oldName) {
      try {
        await updateCategory(id, { name: newName });
        await loadCategories(); // Tải lại danh sách
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Cập nhật thất bại."));
      }
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      try {
        await deleteCategory(id);
        await loadCategories(); // Tải lại danh sách
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Xóa thất bại."));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🏷️ Quản lý Danh mục</h1>

      {/* Form Thêm mới */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thêm danh mục mới</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Tên danh mục (ví dụ: iPhone, Samsung...)"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* Bảng Danh sách */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">⏳ Đang tải danh sách...</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-700">Tên Danh mục</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-700 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-6 text-center text-gray-500">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(cat._id, cat.name)}
                        className="px-4 py-1.5 bg-yellow-400 text-white text-sm font-medium rounded-md hover:bg-yellow-500 transition"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}