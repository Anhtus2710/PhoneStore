// src/features/my-orders/OrderDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import hooks
import { getOrderDetails } from '../../api/orderApi'; // Import API lấy chi tiết

// SỬA LẠI TẠI ĐÂY: Import đúng file CSS của nó
import "./orderDetail.css"; 

export default function OrderDetail() {
  const { id: orderId } = useParams(); // Lấy ID đơn hàng từ URL
  const [order, setOrder] = useState(null); // State lưu trữ thông tin đơn hàng
  const [loading, setLoading] = useState(true); // State theo dõi tải dữ liệu
  const [error, setError] = useState(null); // State lưu lỗi

  // Tải chi tiết đơn hàng khi component mount hoặc ID thay đổi
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getOrderDetails(orderId); // Gọi API
        setOrder(data); // Lưu dữ liệu vào state
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err);
        setError("Không thể tải thông tin chi tiết đơn hàng.");
        // Xử lý lỗi 403 (không có quyền) hoặc 404 (không tìm thấy)
        if (err.response?.status === 403) {
          setError("Bạn không có quyền xem đơn hàng này.");
        } else if (err.response?.status === 404) {
          setError("Không tìm thấy đơn hàng.");
        }
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchOrderDetail();
  }, [orderId]); // Chạy lại nếu orderId thay đổi

  // Hiển thị trạng thái tải
  if (loading) {
    return <p className="container">⏳ Đang tải chi tiết đơn hàng...</p>;
  }

  // Hiển thị lỗi
  if (error) {
    return <p className="container error-message">⚠️ {error}</p>;
  }

  // Nếu không có lỗi nhưng không tìm thấy đơn hàng
  if (!order) {
    return <p className="container">Không tìm thấy thông tin đơn hàng.</p>;
  }

  // --- Render chi tiết đơn hàng ---
  return (
    <div className="container order-detail-page">
      <h1>Chi tiết đơn hàng #{order._id.substring(0, 8)}...</h1>

      <div className="order-detail-grid">
        {/* --- Cột 1: Thông tin chung & Địa chỉ (Nền tối) --- */}
        <div className="order-info-section">
          <div className="info-card">
            <h3>Thông tin chung</h3>
            <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
            <p><strong>Trạng thái:</strong>
              {/* Sử dụng class 'status' từ file myOrders.css (cần import cả myOrders.css nếu muốn dùng chung) */}
              <span className={`status status-${order.status || 'pending'}`}>
                {order.status === 'paid' ? 'Đã thanh toán' :
                  order.status === 'shipped' ? 'Đã giao hàng' :
                    order.status === 'cancelled' ? 'Đã hủy' :
                      'Chờ xử lý'}
              </span>
            </p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          </div>

          <div className="info-card">
            <h3>Địa chỉ giao hàng</h3>
            <p><strong>Người nhận:</strong> {order.shippingAddress?.fullName}</p>
            <p><strong>Điện thoại:</strong> {order.shippingAddress?.phone}</p>
            <p>
              <strong>Địa chỉ:</strong>
              {/* Nối chuỗi địa chỉ (lọc ra các phần undefined nếu có) */}
              {[
                order.shippingAddress?.street,
                order.shippingAddress?.ward,
                order.shippingAddress?.district,
                order.shippingAddress?.province
              ].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>

        {/* --- Cột 2: Sản phẩm & Tổng tiền (Nền sáng) --- */}
        <div className="order-items-section">
          <h3>Sản phẩm trong đơn</h3>
          <div className="order-items-list">
            {/* Lặp qua danh sách sản phẩm (đã được populate) */}
            {order.products?.map((item) => (
              <div className="order-item" key={item.product?._id || item._id}>
                <img
                  src={`http://localhost:5000${item.product?.image}`}
                  alt={item.product?.name || 'Sản phẩm'}
                  className="item-image"
                />
                <div className="item-info">
                  <Link to={`/product/${item.product?.slug}`}>{item.product?.name || 'Sản phẩm không xác định'}</Link>
                  <p>Số lượng: {item.qty}</p>
                </div>
                <div className="item-price">
                  {(item.product?.price * item.qty || 0).toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
          {/* Tổng tiền */}
          <div className="order-total">
            <strong>Tổng cộng:</strong>
            <strong>{(order.total || 0).toLocaleString()} đ</strong>
          </div>
        </div>
      </div>

      {/* Link quay lại */}
      <Link to="/my-orders" className="back-link">
        ← Quay lại lịch sử đơn hàng
      </Link>
    </div>
  );
}