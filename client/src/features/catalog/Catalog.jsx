import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import "./catalog.css"; // Chuyển file css vào đây

export default function CatalogFeature() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories"); // Dùng api
        setCategories(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // Lấy sản phẩm theo danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url =
          category === "all"
            ? "/products"
            : `/products?category=${category}`;
        const { data } = await api.get(url); // Dùng api
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Lỗi khi tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    // Đã xóa <header> (navbar)
    <div className="container">
      <div className="catalog-content">
        <h2>Danh sách sản phẩm</h2>

        {/* Bộ lọc danh mục */}
        <div className="filter">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>⏳ Đang tải sản phẩm...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="grid">
          {!loading && products.length > 0 ? (
            products.map((p) => (
              <Link
                className="card"
                key={p._id}
                to={`/product/${p._id}`} // Link đến trang chi tiết
              >
                {p.image ? (
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: `url(http://localhost:5000${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="thumb">{(p.name || "").charAt(0)}</div>
                )}
                <div className="card-body">
                  <div className="name">{p.name}</div>
                  <div className="price">
                    {(p.price || 0).toLocaleString()} đ
                  </div>
                </div>
              </Link>
            ))
          ) : (
            !loading && <p>Không có sản phẩm nào trong danh mục này</p>
          )}
        </div>
      </div>
    </div>
  );
}