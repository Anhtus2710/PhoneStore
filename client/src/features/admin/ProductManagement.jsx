import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { getAdminProducts, deleteProduct } from "../../api/adminApi"; 
import "./admin.css"; // Đảm bảo import CSS

// Component Quản lý Sản phẩm
export default function QuanLySanPham() {
  const dieuHuong = useNavigate(); 
  const [danhSachSanPham, datDanhSachSanPham] = useState([]); 
  const [dangTai, datDangTai] = useState(true); 
  const [loi, datLoi] = useState(null); 

  // Hàm tải danh sách sản phẩm (giữ nguyên)
  const taiDanhSachSanPham = async () => {
    // ... (code giữ nguyên)
    datDangTai(true); 
    datLoi(null); 
    try {
      const phanHoi = await getAdminProducts(); 
      datDanhSachSanPham(phanHoi.data); 
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err); 
      datLoi("Không thể tải danh sách sản phẩm."); 
    } finally {
      datDangTai(false); 
    }
  };

  // Tải danh sách khi component mount (giữ nguyên)
  useEffect(() => {
    taiDanhSachSanPham();
  }, []); 

  // Hàm xóa sản phẩm (giữ nguyên)
  const xuLyXoaSanPham = async (idSanPham) => {
    // ... (code giữ nguyên)
     if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm này không?`)) {
      try {
        await deleteProduct(idSanPham); 
        alert("Xóa sản phẩm thành công!"); 
        taiDanhSachSanPham(); 
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Hàm sửa sản phẩm (giữ nguyên)
  const xuLySuaSanPham = (idSanPham) => {
    dieuHuong(`/admin/products/edit/${idSanPham}`);
  };

  // --- Render Giao diện ---
  if (dangTai) {
    return <p>⏳ Đang tải danh sách sản phẩm...</p>;
  }
  if (loi) {
    return <p>⚠️ {loi}</p>;
  }

  return (
    <>
      <h1>📦 Quản lý sản phẩm</h1>
      <button className="btn-add" onClick={() => dieuHuong("/admin/products/add")}>
        + Thêm sản phẩm mới
      </button>

      {/* Bảng hiển thị danh sách sản phẩm */}
      <table className="admin-table">
        <thead>
          <tr>
            {/* 1. THÊM CỘT HÌNH ẢNH */}
            <th>Hình ảnh</th> 
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {danhSachSanPham.length === 0 ? (
            <tr>
              {/* 2. CẬP NHẬT COLSPAN */}
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td> 
            </tr>
          ) : (
            danhSachSanPham.map((sanPham) => (
              <tr key={sanPham._id}>
                {/* 3. THÊM Ô HIỂN THỊ ẢNH */}
                <td>
                  {sanPham.image ? (
                    <img 
                      // Nhớ thêm địa chỉ backend
                      src={`http://localhost:5000${sanPham.image}`} 
                      alt={sanPham.name} 
                      className="admin-product-image" // Thêm class để CSS
                    />
                  ) : (
                    <span className="no-image">N/A</span> // Hoặc hiển thị gì đó nếu không có ảnh
                  )}
                </td>
                <td>{sanPham.name}</td>
                <td>{(sanPham.price || 0).toLocaleString()} đ</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => xuLySuaSanPham(sanPham._id)} 
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => xuLyXoaSanPham(sanPham._id)} 
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}