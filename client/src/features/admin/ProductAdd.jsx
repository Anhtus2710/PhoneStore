import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/adminApi";
import ProductForm from "./ProductForm"; // Import Form chung

export default function ThemSanPham() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm xử lý khi Form chung được submit
  const handleCreateSubmit = async (formData, imageFile) => {
    // Kiểm tra lại file ảnh (mặc dù form đã required)
    if (!imageFile) {
      setError("Vui lòng chọn một hình ảnh.");
      return;
    }

    setLoading(true);
    setError(null);

    // Tạo FormData
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("slug", formData.slug);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("category", formData.category);
    productData.append("image", imageFile); 

    try {
      await createProduct(productData);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hiển thị lỗi (nếu có) bên ngoài Form */}
      {error && <p className="error-message" style={{ maxWidth: '800px', margin: '0 auto 1rem auto' }}>⚠️ {error}</p>}
      {/* Render Form chung */}
      <ProductForm 
        onSubmit={handleCreateSubmit} 
        loading={loading} 
        isEditing={false} // Đánh dấu là đang Thêm mới
      />
    </>
  );
}