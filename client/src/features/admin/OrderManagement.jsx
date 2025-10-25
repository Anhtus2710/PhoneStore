import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/adminApi";
import "./admin.css";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        setError("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <p>⏳ Đang tải danh sách đơn hàng...</p>;
  if (error) return <p>⚠️ {error}</p>;

  return (
    <>
      <h1>🛒 Quản lý đơn hàng</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.user?.name || "N/A"}</td>
              <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
              <td>{(order.totalPrice || 0).toLocaleString()} đ</td>
              <td>{order.isPaid ? "✅ Đã thanh toán" : "Chưa"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}