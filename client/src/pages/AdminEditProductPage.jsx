// src/pages/AdminEditProductPage.jsx
import React from 'react';
import AdminLayout from '../layouts/AdminLayout'; // Import Layout chung
import SuaSanPham from '../features/admin/ProductEdit'; // Import component chứa form Sửa

// Trang Chỉnh sửa Sản phẩm
export default function AdminEditProductPage() {
  return (
    <AdminLayout> {/* Bọc bằng layout admin */}
      <SuaSanPham /> {/* Hiển thị component chứa form sửa */}
    </AdminLayout>
  );
}