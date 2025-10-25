import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js"; // Sửa "axiosConfig" thành "axios.js"
import { useCart } from "../../store/CartContext"; // Dùng Cart Context
import "./product.css"; // Chuyển file css vào đây

export default function ProductFeature() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Lấy cartCount và addToCart từ Context
  const { cartCount, addToCart } = useCart();

  // Load sản phẩm theo _id
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`); // Dùng api
        setProduct(data);
      } catch (err) {
        console.error("❌ Lỗi load chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 2. Xóa toàn bộ useEffect của cartCount (Context đã xử lý)

  if (loading) return <p>⏳ Đang tải...</p>;
  if (!product) return <p>⚠️ Không tìm thấy sản phẩm.</p>;

  // 3. Đơn giản hóa hàm
  const handleAddToCart = () => {
    addToCart(product, 1); // Gọi hàm từ Context
    alert("✅ Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    addToCart(product, 1); // Gọi hàm từ Context
    navigate("/cart");
  };

  return (
    <div className="product-detail">
      {/* Floating giỏ hàng (Giữ nguyên) */}
      <button
        className="cart-fab"
        onClick={() => navigate("/cart")}
        aria-label="Xem giỏ hàng"
      >
        <span className="cart-ico">🛒</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>

      <Link to="/catalog">← Quay lại danh mục</Link>

      <div className="product-detail-content">
        <div style={{ width: 340 }}>
          {product.image ? (
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />
          ) : (
            <div className="image-placeholder">
              {(product.name || "?").charAt(0)}
            </div>
          )}
        </div>

        <div>
          <h2>{product.name}</h2>
          {product.category && (
            <p>
              <strong>Danh mục:</strong> {product.category.name}
            </p>
          )}
          <p>
            <strong>Giá:</strong> {(product.price || 0).toLocaleString()} VND
          </p>
          <p>
            <strong>Mô tả:</strong> {product.description || "Chưa có mô tả"}
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button className="btn-add" onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}