import React, { useEffect, useState } from "react";
import { getStats } from "../../api/adminApi";
import "./admin.css"; // Import CSS chung

// 1. Import các icon
import { 
  FaDollarSign, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaUsers 
} from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Lỗi load thống kê:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <p>⏳ Đang tải dữ liệu thống kê...</p>;
  }

  return (
    <>
      <h1>Bảng điều khiển</h1>
      {stats ? (
        <div className="stats-grid">
          {/* 2. Cấu trúc thẻ đã thay đổi */}
          <div className="stat-card">
            <div className="stat-icon icon-revenue">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <h3>{(stats.revenue || 0).toLocaleString()} đ</h3>
              <p>Tổng doanh thu</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-products">
              <FaBoxOpen />
            </div>
            <div className="stat-info">
              <h3>{stats.products || 0}</h3>
              <p>Sản phẩm</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-orders">
              <FaShoppingCart />
            </div>
            <div className="stat-info">
              <h3>{stats.orders || 0}</h3>
              <p>Đơn hàng</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon icon-users">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.users || 0}</h3>
              <p>Người dùng</p>
            </div>
          </div>
          
        </div>
      ) : (
        <p>⚠️ Không lấy được dữ liệu thống kê.</p>
      )}

      {/* Bạn có thể thêm các biểu đồ hoặc bảng "Đơn hàng mới" ở đây */}
    </>
  ); 
}  