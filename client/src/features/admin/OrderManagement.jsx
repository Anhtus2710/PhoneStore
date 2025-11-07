import React, { useEffect, useState, useCallback } from "react";
// 1. Import thêm icon tìm kiếm
import { FaSearch } from "react-icons/fa";
// Import API functions (đã sửa tên hàm search)
import { getOrders, updateOrderStatus, searchOrders } from "../../api/adminApi";


export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // --- HÀM TẢI/TÌM KIẾM ĐƠN HÀNG ---
  const loadOrders = useCallback(async (keyword = "") => { // Đổi tên tham số
    setLoading(true);
    setError(null);
    setIsSearching(!!keyword);
    try {
      let response;
      if (keyword) {
        // Gọi API tìm kiếm mới
        response = await searchOrders(keyword);
      } else {
        response = await getOrders();
      }
      setOrders(response.data);
    } catch (err) {
      console.error("Lỗi tải/tìm kiếm đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng.");
      setOrders([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);
  // --- KẾT THÚC HÀM TẢI ---

  // Tải tất cả đơn hàng ban đầu (không đổi)
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Hàm xử lý khi nhấn nút/icon Tìm kiếm
  const handleSearch = () => {
    loadOrders(searchTerm.trim());
  };

  // Hàm xử lý khi nhấn Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Hàm reset tìm kiếm (không đổi)
  const resetSearch = () => {
    setSearchTerm("");
    loadOrders();
  }

  // Hàm cập nhật trạng thái (không đổi)
  const handleStatusChange = async (orderId, newStatus) => {
    // ... (code cũ giữ nguyên) ...
  };

  // ... (render loading, error) ...

  const validStatuses = ["pending", "paid", "shipped", "cancelled"];

  return (
    <>
      <h1>🛒 Quản lý đơn hàng</h1>
      {error && <p className="error-message">⚠️ {error}</p>}

      {/* --- KHỐI TÌM KIẾM ĐÃ SỬA --- */}
      <div className="search-bar">
        {/* Thêm icon vào input */}
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text" // Đổi thành text để nhập cả SĐT
            placeholder="Tìm theo email hoặc SĐT..." // Đổi placeholder
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isSearching}
          />
        </div>
        <button onClick={handleSearch} disabled={loading || isSearching || !searchTerm.trim()}>
          {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
        <button onClick={resetSearch} disabled={loading || isSearching} className="btn-reset">
          Hiện tất cả
        </button>
      </div>
      {/* --- KẾT THÚC KHỐI TÌM KIẾM --- */}


      <table className="admin-table">
        {/* ... (thead, tbody giữ nguyên, chỉ sửa thông báo khi không có kết quả) ... */}
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng Thái Hiện Tại</th>
            <th>Cập nhật Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>⏳ Đang tải...</td></tr>
          )}
          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                {/* Sửa lại thông báo */}
                {searchTerm ? `Không tìm thấy đơn hàng nào khớp với "${searchTerm}".` : "Chưa có đơn hàng nào."}
              </td>
            </tr>
          )}
          {!loading && orders.map((order) => (
            // ... (code map đơn hàng giữ nguyên) ...
            <tr key={order._id}>
              <td>{order.user?.name || "N/A"} ({order.user?.email || "N/A"})</td>
              <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
              <td>{(order.total || 0).toLocaleString()} đ</td>
              <td className={`status status-${order.status || 'pending'}`}>
                {order.status === 'paid' ? 'Đã thanh toán' :
                  order.status === 'shipped' ? 'Đã giao hàng' :
                    order.status === 'cancelled' ? 'Đã hủy' :
                      'Chờ xử lý'}
              </td>
              <td>
                <select
                  value={order.status || 'pending'}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updatingStatusId === order._id || order.status === 'shipped' || order.status === 'cancelled'}
                  className="status-select"
                >
                  {validStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'paid' ? 'Đã thanh toán' :
                        status === 'shipped' ? 'Đã giao hàng' :
                          status === 'cancelled' ? 'Đã hủy' :
                            'Chờ xử lý'}
                    </option>
                  ))}
                </select>
                {updatingStatusId === order._id && <span className="status-loading">⏳</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}