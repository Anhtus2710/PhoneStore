import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import "./home.css";


const LATEST_PRO_SLUG = "iphone-15-pro-max-256gb";
const LATEST_BASE_SLUG = "iphone-17-pro";
const SE_SLUG = "iphone-se";

export default function HomeFeature() {

  const [latestPro, setLatestPro] = useState(null);
  const [latestBase, setLatestBase] = useState(null);
  const [iphoneSE, setIphoneSE] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [proRes, baseRes, seRes] = await Promise.all([
          api.get(`/products/slug/${LATEST_PRO_SLUG}`).catch(e => null),
          api.get(`/products/slug/${LATEST_BASE_SLUG}`).catch(e => null),
          api.get(`/products/slug/${SE_SLUG}`).catch(e => null)
        ]);

        if (proRes) setLatestPro(proRes.data);
        if (baseRes) setLatestBase(baseRes.data);
        if (seRes) setIphoneSE(seRes.data);

      } catch (err) {
        console.error("Error fetching homepage products:", err);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const renderProductLinks = (product) => (
    <div className="cta-links">
      <Link to={`/product/${product._id}`} className="cta-link learn-more">
        Tìm hiểu thêm &gt;
      </Link>
      <Link to={`/product/${product._id}`} className="cta-link buy">
        Mua &gt;
      </Link>
    </div>
  );

  if (loading) {
    return <div className="home-loading">Đang tải...</div>; // Simple loading state
  }
  if (error) {
    return <div className="home-error">{error}</div>;
  }

  return (
    <div className="apple-home-container">
      {/* === Section 1: Latest Pro Model === */}
      {latestPro && (
        <section className="hero-section hero-pro">
          <div className="hero-content">
            <h2 className="hero-title">{latestPro.name}</h2>
            <p className="hero-subtitle">Pro. Mạnh mẽ vượt trội.</p>
            {renderProductLinks(latestPro)}
          </div>
          <div className="hero-image-container">
            {/* Use high-quality image */}
            <img src={`http://localhost:5000${latestPro.image}`} alt={latestPro.name} className="hero-image" />
          </div>
        </section>
      )}

      {/* === Section 2: Latest Base Model === */}
      {latestBase && (
        <section className="hero-section hero-base">
          <div className="hero-content">
            <h2 className="hero-title">{latestBase.name}</h2>
            <p className="hero-subtitle">Một đẳng cấp mới.</p>
            {renderProductLinks(latestBase)}
          </div>
          <div className="hero-image-container">
            <img src={`http://localhost:5000${latestBase.image}`} alt={latestBase.name} className="hero-image" />
          </div>
        </section>
      )}

      {/* === Section 3: iPhone SE (or another featured product) === */}
      {iphoneSE && (
        <section className="hero-section hero-se">
          <div className="hero-content">
            <h2 className="hero-title">{iphoneSE.name}</h2>
            <p className="hero-subtitle">Hiệu năng mạnh mẽ. Giá trị hấp dẫn.</p>
            {renderProductLinks(iphoneSE)}
          </div>
          <div className="hero-image-container">
            <img src={`http://localhost:5000${iphone17.image}`} alt={iphoneSE.name} className="hero-image hero-image-se" />
          </div>
        </section>
      )}

      {/* === Section 4: Optional "Why Apple" or Accessories section === */}
      <section className="info-section">
        {/* Add content here like links to accessories, compare models, etc. */}
        <h3>So sánh các dòng máy iPhone</h3>
        <Link to="/catalog" className="cta-link">Xem tất cả &gt;</Link>
      </section>

    </div>
  );
}