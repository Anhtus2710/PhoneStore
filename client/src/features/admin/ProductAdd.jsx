import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/adminApi";
import { getCategories } from "../../api/categoryApi";
import "./productAdd.css";

export default function ProductAdd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho các trường text
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    category: "",
  });
  
  // State riêng cho file
  const [imageFile, setImageFile] = useState(null); 

  // Tải danh sách danh mục khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        // Tự động chọn danh mục đầu tiên làm mặc định
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
        setError("Không thể tải danh sách danh mục.");
      }
    };

    loadCategories();
  }, []); // Chạy 1 lần khi component mount

  // Hàm xử lý cho các trường text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý riêng cho file
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Lấy file đầu tiên
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError("Vui lòng chọn một hình ảnh.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // Tạo FormData để gửi cả text và file
    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("slug", formData.slug);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("category", formData.category);
    productData.append("image", imageFile); // 'image' phải khớp với tên ở middleware

    try {
      // Gửi FormData đến API
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
      <h1>➕ Thêm sản phẩm mới</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        
        {/* --- Các trường Form --- */}

        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug (URL)</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="vi-du-san-pham"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.length === 0 && <option disabled>Đang tải...</option>}
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Hình ảnh sản phẩm</label>
          <input 
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg, image/gif" // Chỉ chấp nhận file ảnh
            onChange={handleFileChange}
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea 
            id="description"
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            rows="5"
          />
        </div>

        {/* --- Thông báo lỗi và Nút bấm --- */}

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </>
  );
}