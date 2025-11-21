import React, { useEffect, useState } from "react";
import { getStats } from "../../api/adminApi";
import {
  FaDollarSign,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaChartLine
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

  const StatCard = ({ icon: Icon, title, value, change, bgColor, iconColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <FaArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <FaArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`text-2xl ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">⏳ Đang tải dữ liệu thống kê...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển</h1>
          <p className="text-gray-600">Tổng quan về hoạt động kinh doanh của bạn</p>
        </div>

        {stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={FaDollarSign}
                title="Tổng doanh thu"
                value={`${(stats.revenue || 0).toLocaleString()} đ`}
                change={12.5}
                bgColor="bg-green-100"
                iconColor="text-green-600"
              />
              <StatCard
                icon={FaBoxOpen}
                title="Sản phẩm"
                value={stats.products || 0}
                change={-3.2}
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <StatCard
                icon={FaShoppingCart}
                title="Đơn hàng"
                value={stats.orders || 0}
                change={8.1}
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
              />
              <StatCard
                icon={FaUsers}
                title="Người dùng"
                value={stats.users || 0}
                change={15.3}
                bgColor="bg-orange-100"
                iconColor="text-orange-600"
              />
            </div>


          </>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">⚠️ Không lấy được dữ liệu thống kê.</p>
          </div>
        )}
      </div>
    </div>
  );
}