import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js"; // Import cấu hình axios
import { getCategories } from "../../api/categoryApi"; // Import API lấy danh mục
import "./home.css"; // Import file CSS mới
import { FaShippingFast, FaTags, FaHeadset } from "react-icons/fa"; // Icons cho cam kết

export default function TrangChu() {
  // State lưu sản phẩm nổi bật và danh mục
  const [sanPhamNoiBat, datSanPhamNoiBat] = useState([]);
  const [danhMuc, datDanhMuc] = useState([]);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState(null);

  // Tải dữ liệu sản phẩm và danh mục
  useEffect(() => {
    const taiDuLieu = async () => {
      datDangTai(true);
      datLoi(null);
      try {
        // Lấy 3 danh mục đầu tiên
        const phanHoiDanhMuc = await getCategories();
        datDanhMuc(phanHoiDanhMuc.data.slice(0, 3)); // Lấy 3 danh mục

        // Lấy 4 sản phẩm làm nổi bật
        const phanHoiSanPham = await api.get("/products");
        datSanPhamNoiBat(phanHoiSanPham.data.slice(0, 4)); // Lấy 4 sản phẩm
      } catch (err) {
        console.error("Lỗi tải dữ liệu trang chủ:", err);
        datLoi("Không thể tải dữ liệu trang chủ.");
      } finally {
        datDangTai(false);
      }
    };
    taiDuLieu();
  }, []);

  if (dangTai) {
    return <div className="home-loading">Đang tải...</div>;
  }
  if (loi) {
    return <div className="home-error">{loi}</div>;
  }

  return (
    <div className="homepage-container">
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Bộ Sưu Tập Mới Nhất</h1>
          <p className="hero-subtitle">Khám phá những sản phẩm công nghệ đỉnh cao.</p>
          <Link to="/catalog" className="btn btn-primary hero-button">
            Mua sắm ngay
          </Link>
        </div>
        {/* <img src="/images/congtyapple.png" alt="Hero background" className="hero-background-image" /> */}
      </section>

      {/* --- 2. Sản phẩm nổi bật --- */}
      <section className="home-section featured-products">
        <h2 className="section-title">Sản phẩm nổi bật</h2>
        <div className="product-grid">
          {sanPhamNoiBat.map((sanPham) => (
            <Link className="product-card" key={sanPham._id} to={`/product/${sanPham.slug}`}>
              <div className="product-card-img-wrapper">
                <img
                  src={`http://localhost:5000${sanPham.image}`}
                  alt={sanPham.name}
                  className="product-card-img"
                  loading="lazy" // Tải ảnh lười biếng
                />
              </div>
              <div className="product-card-info">
                <h3 className="product-name">{sanPham.name}</h3>
                <p className="product-price">{(sanPham.price || 0).toLocaleString()} đ</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/catalog" className="btn btn-secondary">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* --- 3. Khối Danh mục --- */}
      <section className="home-section shop-by-category">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="category-grid">
          {danhMuc.map((muc) => (
            // Sửa lại thuộc tính 'to' của Link
            <Link
              className="category-card"
              key={muc._id}
              to={`/catalog?category=${muc._id}`}
            >
              <div className="category-card-content">
                <h3>{muc.name}</h3>
                <span>Xem ngay &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- 4. Banner Khuyến mãi/Quảng cáo --- */}
      <section className="home-section promo-banner">
        <div className="promo-content">
          <h2>Ưu đãi đặc biệt mùa hè!</h2>
          <p>Giảm giá lên đến 30% cho các phụ kiện chọn lọc.</p>
          <Link to="/catalog" className="btn btn-outline">
            Xem khuyến mãi
          </Link>
        </div>
        {/* <img src="/images/promo-banner-bg.jpg" alt="Promotion Banner" className="promo-background-image"/> */}
      </section>

      {/* --- 5. Cam kết Cửa hàng (Trust Badges) --- */}
      <section className="home-section store-features">
        <div className="feature-item">
          <div className="feature-icon-wrapper"><FaShippingFast /></div>
          <h3>Giao hàng toàn quốc</h3>
          <p>Nhanh chóng, tiện lợi, miễn phí cho đơn hàng lớn.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon-wrapper"><FaTags /></div>
          <h3>Ưu đãi hấp dẫn</h3>
          <p>Luôn cập nhật khuyến mãi và giá tốt nhất.</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon-wrapper"><FaHeadset /></div>
          <h3>Hỗ trợ tận tâm</h3>
          <p>Đội ngũ tư vấn sẵn sàng hỗ trợ 24/7.</p>
        </div>
      </section>
    </div>
  );
}