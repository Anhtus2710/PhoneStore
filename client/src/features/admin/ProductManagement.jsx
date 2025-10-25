import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook để điều hướng
import { getAdminProducts, deleteProduct } from "../../api/adminApi"; // API tương ứng
import "./admin.css"; // CSS chung cho admin

// Component Quản lý Sản phẩm
export default function QuanLySanPham() {
  const dieuHuong = useNavigate(); // Khởi tạo hook điều hướng
  const [danhSachSanPham, datDanhSachSanPham] = useState([]); // State lưu danh sách sản phẩm
  const [dangTai, datDangTai] = useState(true); // State theo dõi trạng thái tải
  const [loi, datLoi] = useState(null); // State lưu trữ lỗi

  // Hàm tải danh sách sản phẩm từ API
  const taiDanhSachSanPham = async () => {
    datDangTai(true); // Bắt đầu tải
    datLoi(null); // Xóa lỗi cũ
    try {
      const phanHoi = await getAdminProducts(); // Gọi API lấy sản phẩm
      datDanhSachSanPham(phanHoi.data); // Lưu dữ liệu vào state
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err); // Ghi log lỗi chi tiết
      datLoi("Không thể tải danh sách sản phẩm."); // Đặt thông báo lỗi cho người dùng
    } finally {
      datDangTai(false); // Kết thúc tải (dù thành công hay thất bại)
    }
  };

  // Tải danh sách sản phẩm khi component được mount (chạy lần đầu)
  useEffect(() => {
    taiDanhSachSanPham();
  }, []); // Mảng rỗng đảm bảo chỉ chạy một lần

  // Hàm xử lý khi nhấn nút Xóa sản phẩm
  const xuLyXoaSanPham = async (idSanPham) => {
    // Hỏi xác nhận trước khi xóa
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm này không?`)) {
      try {
        await deleteProduct(idSanPham); // Gọi API xóa sản phẩm
        alert("Xóa sản phẩm thành công!"); // Thông báo thành công
        taiDanhSachSanPham(); // Tải lại danh sách để cập nhật giao diện
      } catch (err) {
        // Thông báo lỗi cụ thể hơn nếu có từ backend
        alert("Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // Hàm xử lý khi nhấn nút Sửa sản phẩm
  const xuLySuaSanPham = (idSanPham) => {
    // Điều hướng đến trang chỉnh sửa sản phẩm, truyền ID qua URL
    dieuHuong(`/admin/products/edit/${idSanPham}`);
  };

  // --- Render Giao diện ---

  // Hiển thị trạng thái đang tải
  if (dangTai) {
    return <p>⏳ Đang tải danh sách sản phẩm...</p>;
  }

  // Hiển thị nếu có lỗi xảy ra
  if (loi) {
    return <p>⚠️ {loi}</p>;
  }

  // Hiển thị giao diện chính khi có dữ liệu
  return (
    <>
      <h1>📦 Quản lý sản phẩm</h1>

      {/* Nút điều hướng đến trang Thêm sản phẩm mới */}
      <button className="btn-add" onClick={() => dieuHuong("/admin/products/add")}>
        + Thêm sản phẩm mới
      </button>

      {/* Bảng hiển thị danh sách sản phẩm */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Kiểm tra nếu không có sản phẩm nào */}
          {danhSachSanPham.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có sản phẩm nào.</td>
            </tr>
          ) : (
            // Lặp qua danh sách sản phẩm để hiển thị từng hàng
            danhSachSanPham.map((sanPham) => (
              <tr key={sanPham._id}>
                <td>{sanPham.name}</td>
                <td>{(sanPham.price || 0).toLocaleString()} đ</td>
                {/* Cột chứa các nút hành động */}
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => xuLySuaSanPham(sanPham._id)} // Gọi hàm sửa khi nhấn nút
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => xuLyXoaSanPham(sanPham._id)} // Gọi hàm xóa khi nhấn nút
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