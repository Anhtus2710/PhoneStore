import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";
// Import CSS của form
import "./productAdd.css"; 

// Component Form chung cho Thêm và Sửa
export default function ProductForm({ onSubmit, initialData = null, isEditing = false, loading = false }) {
  const navigate = useNavigate(); // Sử dụng navigate thay vì dieuHuong cho nhất quán
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [error, setError] = useState(null); // Lỗi từ API danh mục

  // State cho các trường text (dùng initialData nếu có)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "", // Nên là ID category
  });

  // State cho file ảnh mới
  const [imageFile, setImageFile] = useState(null);
  // State cho URL ảnh (để xem trước)
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");

  // Tải danh sách danh mục
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        // Nếu đang thêm mới và chưa có danh mục, chọn mặc định
        if (!isEditing && !formData.category && res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
        // Nếu đang sửa và initialData chưa có ID category (chỉ có object), tìm ID
        else if (isEditing && initialData?.category?._id && !formData.category) {
            setFormData((prev) => ({ ...prev, category: initialData.category._id }));
        }
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
        setError("Không thể tải danh sách danh mục.");
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, initialData]); // Chạy lại nếu initialData thay đổi (khi sửa)

  // Xử lý thay đổi input text/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file
      setImageUrl(URL.createObjectURL(file)); // Tạo URL xem trước
    } else {
      // Nếu người dùng hủy chọn file, quay lại ảnh ban đầu (nếu có)
      setImageFile(null);
      setImageUrl(initialData?.image || "");
    }
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi hàm onSubmit được truyền từ cha, gửi dữ liệu form và file ảnh
    onSubmit(formData, imageFile); 
  };

  return (
    <>
      {/* Tiêu đề thay đổi tùy theo trạng thái */}
      <h1>{isEditing ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h1>

      {/* Hiển thị ảnh xem trước */}
      {imageUrl && (
         <div style={{ marginBottom: '1rem' }}>
             <p>Ảnh xem trước:</p>
             <img
                src={imageUrl.startsWith('blob:') ? imageUrl : `http://localhost:5000${imageUrl}`}
                alt="Ảnh sản phẩm"
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
             />
         </div>
      )}

      {/* Form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên sản phẩm</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="slug">Slug (URL)</label>
          <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="price">Giá</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0"/>
        </div>
        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} required>
            <option value="" disabled>-- Chọn danh mục --</option>
            {categories.length === 0 && !error && <option disabled>Đang tải...</option>}
            {error && <option disabled>Lỗi tải danh mục</option>}
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          {/* Label thay đổi tùy trạng thái */}
          <label htmlFor="image">
            {isEditing ? "Thay đổi hình ảnh (Để trống nếu không đổi)" : "Hình ảnh sản phẩm"}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            // Không bắt buộc phải chọn file khi sửa
            required={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange}></textarea>
        </div>

        {/* Thông báo lỗi từ component cha sẽ hiển thị ở đây */}
        {/* {error && <p className="error-message">{error}</p>} */}

        {/* Nút bấm */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang xử lý..." : (isEditing ? "Lưu thay đổi" : "Thêm sản phẩm")}
          </button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/admin/products")}>
            Hủy
          </button>
        </div>
      </form>
    </>
  );
}