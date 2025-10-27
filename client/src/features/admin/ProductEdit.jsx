import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateProduct } from "../../api/adminApi"; 
import api from "../../api/axios.js"; 
import ProductForm from "./ProductForm"; // Import Form chung

export default function SuaSanPham() {
  const { id: sanPhamId } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null); // Dữ liệu ban đầu cho form
  const [loading, setLoading] = useState(false); // Loading khi submit
  const [initialLoading, setInitialLoading] = useState(true); // Loading khi tải dữ liệu ban đầu
  const [error, setError] = useState(null);

  // Tải dữ liệu sản phẩm cần sửa
  useEffect(() => {
    const loadProductData = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        // Gọi API lấy chi tiết sản phẩm (cần có API này hoặc dùng /products/:id)
        const res = await api.get(`/products/${sanPhamId}`); // Dùng API public để lấy đủ thông tin
        // Lưu dữ liệu để truyền vào form
        setInitialData({ 
            ...res.data, 
            category: res.data.category?._id // Chỉ lấy ID category
        }); 
      } catch (err) {
        console.error("Lỗi tải dữ liệu sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm để sửa.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProductData();
  }, [sanPhamId]);

  // Hàm xử lý khi Form chung được submit
  const handleUpdateSubmit = async (formData, imageFile) => {
    setLoading(true);
    setError(null);

    // Tạo FormData
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("slug", formData.slug);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("category", formData.category);

    // Chỉ thêm ảnh nếu có file mới được chọn
    if (imageFile) {
      productData.append("image", imageFile);
    }

    try {
      await updateProduct(sanPhamId, productData);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading ban đầu
  if (initialLoading) {
    return <p>⏳ Đang tải dữ liệu sản phẩm...</p>;
  }

  // Hiển thị lỗi nếu tải dữ liệu ban đầu thất bại
  if (error && !initialData) {
     return <p className="error-message" style={{ maxWidth: '800px', margin: '1rem auto' }}>⚠️ {error}</p>;
  }
  
  // Nếu không có dữ liệu ban đầu (ví dụ ID sai)
  if (!initialData) {
      return <p className="error-message" style={{ maxWidth: '800px', margin: '1rem auto' }}>⚠️ Không tìm thấy sản phẩm.</p>;
  }


  return (
    <>
      {/* Hiển thị lỗi (nếu có) bên ngoài Form */}
      {error && <p className="error-message" style={{ maxWidth: '800px', margin: '0 auto 1rem auto' }}>⚠️ {error}</p>}
      {/* Render Form chung và truyền dữ liệu ban đầu */}
      <ProductForm
        onSubmit={handleUpdateSubmit}
        initialData={initialData} // Truyền dữ liệu đã tải
        loading={loading}
        isEditing={true} // Đánh dấu là đang Sửa
      />
    </>
  );
}