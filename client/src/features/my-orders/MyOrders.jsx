import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link to view details
import { getMyOrders, cancelMyOrder } from "../../api/orderApi"; // Import API functions
import "./myOrders.css"; // Assuming you renamed the CSS file too

// Renamed component to MyOrders
export default function MyOrders() {
  const [orders, setOrders] = useState([]); // State for the list of orders
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for errors
  const [cancellingOrderId, setCancellingOrderId] = useState(null); // State to track which order is being cancelled

  // Function to load orders from the API
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyOrders(); // Call API
      setOrders(response.data); // Update state
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Không thể tải lịch sử đơn hàng của bạn."); // Keep UI text Vietnamese
    } finally {
      setLoading(false); // Finish loading
    }
  };

  // Load orders when the component mounts
  useEffect(() => {
    loadOrders();
  }, []); // Empty array -> run once

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    // Confirmation dialog
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác.")) {
      setCancellingOrderId(orderId); // Mark this order as being processed
      setError(null); // Clear previous errors
      try {
        await cancelMyOrder(orderId); // Call cancel API
        alert("Hủy đơn hàng thành công!"); // Keep UI text Vietnamese
        loadOrders(); // Reload the order list to reflect changes
      } catch (err) {
        console.error("Error cancelling order:", err);
        // Show specific error from server if available
        alert("Lỗi khi hủy đơn hàng: " + (err.response?.data?.message || err.message)); // Keep UI text Vietnamese
        setError("Đã xảy ra lỗi khi cố gắng hủy đơn hàng."); // Keep UI text Vietnamese
      } finally {
        setCancellingOrderId(null); // Finished processing, clear the mark
      }
    }
  };

  // Display loading indicator
  if (loading) {
    return <p className="container">⏳ Đang tải lịch sử đơn hàng...</p>; // Keep UI text Vietnamese
  }

  // Display error if loading failed and there are no orders
  if (error && orders.length === 0) {
    return <p className="container error-message">⚠️ {error}</p>;
  }

  return (
    <div className="container my-orders-page">
      <h1>Lịch sử đơn hàng</h1> {/* Keep UI text Vietnamese */}
      {/* Display cancellation errors if any */}
      {error && <p className="error-message">⚠️ {error}</p>}

      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p> // Keep UI text Vietnamese
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              {/* Keep UI text Vietnamese */}
              <th>Mã Đơn Hàng</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => ( // Use 'order' instead of 'dh'
              <tr key={order._id}>
                <td>
                  {/* Link to order details (needs page /order/:id) */}
                  <Link to={`/order/${order._id}`} title="Xem chi tiết">{order._id.substring(0, 8)}...</Link>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                <td>{(order.total || 0).toLocaleString()} đ</td>
                {/* Display status */}
                <td className={`status status-${order.status || 'pending'}`}>
                   {/* Keep UI text Vietnamese */}
                  {order.status === 'paid' ? 'Đã thanh toán' :
                   order.status === 'shipped' ? 'Đã giao hàng' :
                   order.status === 'cancelled' ? 'Đã hủy' :
                   'Chờ xử lý'}
                </td>
                <td>
                  {/* Show Cancel button only if status is 'pending' */}
                  {(order.status === 'pending') && (
                    <button
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order._id)} // Call English function name
                      disabled={cancellingOrderId === order._id} // Disable while processing this order
                    >
                      {/* Change button text while processing */}
                      {cancellingOrderId === order._id ? 'Đang hủy...' : 'Hủy đơn'} {/* Keep UI text Vietnamese */}
                    </button>
                  )}
                  {/* Optionally show "View Details" link for other statuses */}
                  {order.status !== 'pending' && (
                     <Link to={`/order/${order._id}`} className="btn-view-details">Xem chi tiết</Link> // Keep UI text Vietnamese
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}