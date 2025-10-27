import React, { useEffect, useState } from "react";
// Import API functions
import { getOrders, updateOrderStatus } from "../../api/adminApi"; 
import "./admin.css"; // Import shared admin CSS

// Order Management Component (Admin)
export default function OrderManagement() {
  const [orders, setOrders] = useState([]); // State for the list of orders
  const [loading, setLoading] = useState(true); // State for initial loading
  const [error, setError] = useState(null); // State for errors
  // State to track which order's status is currently being updated
  const [updatingStatusId, setUpdatingStatusId] = useState(null); // Stores the ID of the order being updated

  // Function to load orders from the API
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrders(); // Call the API to get all orders (admin)
      setOrders(response.data); // Update the orders state
    } catch (err) {
      console.error("Error loading orders:", err); // Log detailed error
      setError("Không thể tải danh sách đơn hàng."); // Set user-facing error message
    } finally {
      setLoading(false); // Finish loading (success or failure)
    }
  };

  // Load orders when the component mounts
  useEffect(() => {
    loadOrders();
  }, []); // Empty dependency array means run once on mount

  // --- FUNCTION TO HANDLE STATUS UPDATE ---
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId); // Mark this order as being updated
    setError(null); // Clear previous errors
    try {
      // Call the API to update the order status
      await updateOrderStatus(orderId, { status: newStatus });
      
      // Update the status locally in the state for immediate UI feedback
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      // Optional: Show success alert
      // alert("Cập nhật trạng thái thành công!"); 

    } catch (err) {
      console.error("Error updating order status:", err);
      // Show specific error from server if available
      alert("Lỗi khi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
      setError("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng."); // Set general error message
    } finally {
      setUpdatingStatusId(null); // Finish updating, remove loading indicator for this order
    }
  };
  // --- END STATUS UPDATE FUNCTION ---


  // Display loading state
  if (loading) {
    return <p>⏳ Đang tải danh sách đơn hàng...</p>;
  }
  // Display error if loading failed and there are no orders to show
  if (error && orders.length === 0) {
    return <p>⚠️ {error}</p>;
  }

  // Valid order statuses (from Order.js Model)
  const validStatuses = ["pending", "paid", "shipped", "cancelled"]; 

  return (
    <>
      <h1>🛒 Quản lý đơn hàng</h1>
      {/* Display update errors if any */}
      {error && <p className="error-message">⚠️ {error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            {/* Optional: Add Order ID column */}
            {/* <th>ID Đơn Hàng</th> */}
            <th>Người dùng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng Thái Hiện Tại</th> 
            <th>Cập nhật Trạng Thái</th> 
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có đơn hàng nào.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                {/* <td>{order._id.substring(0, 8)}...</td> */}
                <td>{order.user?.name || "N/A"} ({order.user?.email || "N/A"})</td>
                <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                {/* Use 'total' field from Model */}
                <td>{(order.total || 0).toLocaleString()} đ</td> 
                {/* Display current status */}
                <td className={`status status-${order.status || 'pending'}`}> 
                  {order.status === 'paid' ? 'Đã thanh toán' : 
                   order.status === 'shipped' ? 'Đã giao hàng' : 
                   order.status === 'cancelled' ? 'Đã hủy' : 
                   'Chờ xử lý'}
                </td>
                {/* Select dropdown to update status */}
                <td>
                  <select 
                    value={order.status || 'pending'} // Current value
                    onChange={(e) => handleStatusChange(order._id, e.target.value)} // Call update function on change
                    // Disable if currently updating this order or if it's already shipped/cancelled
                    disabled={updatingStatusId === order._id || order.status === 'shipped' || order.status === 'cancelled'} 
                    className="status-select" // Add class for styling (optional)
                  >
                    {validStatuses.map(status => (
                      <option key={status} value={status}>
                        {/* Display Vietnamese status names */}
                        {status === 'paid' ? 'Đã thanh toán' : 
                         status === 'shipped' ? 'Đã giao hàng' : 
                         status === 'cancelled' ? 'Đã hủy' : 
                         'Chờ xử lý'}
                      </option>
                    ))}
                  </select>
                  {/* Show mini spinner if this order is being updated */}
                  {updatingStatusId === order._id && <span className="status-loading">⏳</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}