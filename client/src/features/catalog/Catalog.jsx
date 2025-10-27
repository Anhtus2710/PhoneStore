import React, { useEffect, useState } from "react";
// 1. Import thêm `useLocation` để đọc URL
import { Link, useLocation } from "react-router-dom";
import api from "../../api/axios.js";
import "./catalog.css"; // Giữ nguyên import CSS

// 2. Hàm helper để phân tích query string từ URL
function useQuery() {
  // Lấy phần search (?category=...) từ URL
  const { search } = useLocation();
  // Dùng URLSearchParams để dễ dàng lấy giá trị
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function CatalogFeature() {
  const query = useQuery(); // Khởi tạo hook để đọc query
  // 3. Lấy giá trị 'category' từ URL (?category=abcxyz), nếu không có thì mặc định là 'all'
  const initialCategory = query.get("category") || "all";

  const [products, setProducts] = useState([]); // State danh sách sản phẩm
  const [categories, setCategories] = useState([]); // State danh sách danh mục
  // 4. Khởi tạo state 'category' bằng giá trị lấy từ URL
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true); // State đang tải
  const [error, setError] = useState(null); // State báo lỗi

  // Lấy danh sách danh mục (không thay đổi)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []); // Chỉ chạy 1 lần

  // Lấy sản phẩm dựa trên state 'category' (không thay đổi logic gọi API)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Tạo URL dựa trên giá trị 'category' hiện tại
        const url =
          category === "all"
            ? "/products" // Lấy tất cả nếu là 'all'
            : `/products?category=${category}`; // Lọc theo ID nếu khác 'all'
        const { data } = await api.get(url); // Gọi API backend
        setProducts(Array.isArray(data) ? data : []); // Cập nhật state sản phẩm
      } catch (err) {
        setError(err?.response?.data?.message || "Lỗi khi tải sản phẩm");
        setProducts([]); // Đặt lại danh sách nếu có lỗi
      } finally {
        setLoading(false); // Kết thúc trạng thái tải
      }
    };
    fetchProducts();
  }, [category]); // Chạy lại mỗi khi state 'category' thay đổi (do chọn từ select hoặc do URL ban đầu)

  return (
    <div className="container">
      <div className="catalog-content">
        <h2>Danh sách sản phẩm</h2>

        {/* Bộ lọc danh mục */}
        <div className="filter">
          {/* Select vẫn hoạt động bình thường, giá trị được cập nhật vào state 'category' */}
          <select
            value={category} // Giá trị hiện tại của select
            onChange={(e) => setCategory(e.target.value)} // Cập nhật state khi người dùng chọn
          >
            <option value="all">Tất cả</option>
            {/* Hiển thị các danh mục lấy từ API */}
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hiển thị trạng thái tải hoặc lỗi */}
        {loading && <p>⏳ Đang tải sản phẩm...</p>}
        {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

        {/* Lưới hiển thị sản phẩm */}
        <div className="grid">
          {/* Kiểm tra nếu không đang tải và có sản phẩm */}
          {!loading && products.length > 0 ? (
            // Lặp qua danh sách sản phẩm để hiển thị
            products.map((p) => (
              // Mỗi sản phẩm là một Link đến trang chi tiết (dùng slug)
              <Link
                className="card"
                key={p._id}
                to={`/product/${p.slug}`} // Sử dụng slug cho URL
              >
                {/* Ảnh sản phẩm */}
                {p.image ? (
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: `url(http://localhost:5000${p.image})`, // Nhớ thêm địa chỉ backend
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  // Placeholder nếu không có ảnh
                  <div className="thumb">{(p.name || "").charAt(0)}</div>
                )}
                {/* Thông tin sản phẩm */}
                <div className="card-body">
                  <div className="name">{p.name}</div>
                  <div className="price">
                    {(p.price || 0).toLocaleString()} đ
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Thông báo nếu không có sản phẩm (và không đang tải)
            !loading && <p>Không có sản phẩm nào trong danh mục này.</p>
          )}
        </div>
      </div>
    </div>
  );
}