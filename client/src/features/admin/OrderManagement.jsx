import React, { useEffect, useState, useCallback } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaCalendar, FaDollarSign } from "react-icons/fa";
import { getOrders, updateOrderStatus, searchOrders } from "../../api/adminApi";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const loadOrders = useCallback(async (keyword = "") => {
    setLoading(true);
    setError(null);
    setIsSearching(!!keyword);
    try {
      let response;
      if (keyword) {
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

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = () => {
    loadOrders(searchTerm.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    loadOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn đổi trạng thái đơn hàng này sang "${newStatus}"?`)) {
      return;
    }
    
    setUpdatingStatusId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái đơn hàng.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'shipped': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chờ xử lý';
    }
  };

  const validStatuses = ["pending", "paid", "shipped", "cancelled"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" />
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo email hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || isSearching}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || isSearching || !searchTerm.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
            <button
              onClick={resetSearch}
              disabled={loading || isSearching}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Hiện tất cả
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">⏳ Đang tải...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <FaShoppingCart className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? `Không tìm thấy đơn hàng nào khớp với "${searchTerm}".` : "Chưa có đơn hàng nào."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        Người dùng
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        Ngày đặt
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-gray-400" />
                        Tổng tiền
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Cập nhật
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.user?.name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {(order.total || 0).toLocaleString()} đ
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status || 'pending')}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingStatusId === order._id || order.status === 'shipped' || order.status === 'cancelled'}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            {validStatuses.map(status => (
                              <option key={status} value={status}>
                                {getStatusText(status)}
                              </option>
                            ))}
                          </select>
                          {updatingStatusId === order._id && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}