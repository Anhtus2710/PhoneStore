import React, { useEffect, useState } from "react";
// 1. Lấy slug từ URL
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../store/CartContext";
import "./product.css";

export default function ProductFeature() {
  // 2. Đổi tên biến thành 'slug'
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartCount, addToCart } = useCart();

  // Load sản phẩm theo SLUG
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null); // Reset product state khi slug thay đổi
      try {
        // 3. Gọi API bằng slug
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data);
      } catch (err) {
        console.error("❌ Lỗi load chi tiết sản phẩm:", err);
        // Không set lỗi ở đây, để render thông báo "Không tìm thấy"
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi API nếu slug có giá trị
    if (slug) {
      fetchProduct();
    } else {
      setLoading(false); // Dừng loading nếu không có slug
    }
    // 4. Dependency là slug
  }, [slug]);

  // Hiển thị trạng thái đang tải
  if (loading) return <p>⏳ Đang tải...</p>;
  // Hiển thị nếu không tìm thấy sản phẩm sau khi đã tải xong
  if (!product) return <p>⚠️ Không tìm thấy sản phẩm.</p>;

  // Hàm xử lý thêm vào giỏ hàng (giữ nguyên)
  const handleAddToCart = () => {
    addToCart(product, 1);
    alert("✅ Đã thêm vào giỏ hàng");
  };

  // Hàm xử lý mua ngay (giữ nguyên)
  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <div className="product-detail">
      {/* Nút giỏ hàng nổi (giữ nguyên) */}
      <button
        className="cart-fab"
        onClick={() => navigate("/cart")}
        aria-label="Xem giỏ hàng"
      >
        <span className="cart-ico">🛒</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      {/* Link quay lại danh mục (giữ nguyên) */}
      <Link to="/catalog">← Quay lại danh mục</Link>

      {/* Nội dung chi tiết sản phẩm (giữ nguyên cấu trúc JSX) */}
      <div className="product-detail-content">
        {/* Phần hiển thị ảnh */}
        <div className="hero-image-container"> {/* Sử dụng class từ home.css nếu muốn đồng bộ */}
          {product.image ? (
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="hero-image" // Sử dụng class từ home.css
            />
          ) : (
            <div className="image-placeholder">
              {(product.name || "?").charAt(0)}
            </div>
          )}
        </div>

        {/* Phần thông tin sản phẩm */}
        <div className="hero-content"> {/* Sử dụng class từ home.css nếu muốn đồng bộ */}
          <h2 className="hero-title">{product.name}</h2>
          {product.category && (
            <p className="hero-subtitle">
              <strong>Danh mục:</strong> {product.category.name}
            </p>
          )}
          <p className="hero-subtitle">
            <strong>Giá:</strong>{" "}
            {(product.price || 0).toLocaleString()} VND
          </p>
          <p className="hero-subtitle">
            <strong>Mô tả:</strong> {product.description || "Chưa có mô tả"}
          </p>

          {/* Các nút bấm */}
          <div className="cta-links"> {/* Sử dụng class từ home.css */}
            {/* Có thể giữ lại class cũ hoặc đổi */}
            <button className="cta-link buy" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button className="cta-link learn-more" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}