import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../store/CartContext"; // Dùng Cart Context
import { useAuth } from "../../store/AuthContext"; // Dùng Auth Context
import "./checkout.css"; // Tạo file css mới

export default function CheckoutFeature() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin user
  const { cartItems, totalPrice, clearCart } = useCart(); // Lấy giỏ hàng

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho form địa chỉ
  const [form, setForm] = useState({
    fullName: user?.name || "", // Lấy tên user làm mặc định
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // SỬA LẠI HOÀN TOÀN HÀM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống.");
      return;
    }

    if (!user) {
      setError("Bạn cần đăng nhập để đặt hàng.");
      navigate("/login");
      return;
    }

    setLoading(true);

    // 1. Tạo dữ liệu đơn hàng chuẩn
    const orderData = {
      shippingAddress: form,
      paymentMethod: "COD", // Tạm thời
      orderItems: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalPrice: totalPrice,
    };

    try {
      // 2. Gửi đơn hàng (API đã tự đính kèm token)
      const { data } = await api.post("/orders", orderData);

      // 3. Thành công
      alert("Đặt hàng thành công! Mã đơn hàng của bạn là: " + data._id);
      clearCart(); // Xóa giỏ hàng
      navigate("/home"); // Về trang chủ

    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="checkout-layout">

        {/* Cột 1: Thông tin giao hàng */}
        <div className="checkout-form">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <input name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={onChange} required />
            <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={onChange} required />
            <input name="province" placeholder="Tỉnh/Thành phố" value={form.province} onChange={onChange} required />
            <input name="district" placeholder="Quận/Huyện" value={form.district} onChange={onChange} required />
            <input name="ward" placeholder="Phường/Xã" value={form.ward} onChange={onChange} required />
            <input name="street" placeholder="Số nhà, tên đường" value={form.street} onChange={onChange} required />

            {error && <p className="error-message">{error}</p>}

            <button typeIAm="submit" className="btn-checkout-submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
            </button>
          </form>
        </div>

        {/* Cột 2: Tóm tắt đơn hàng */}
        <div className="checkout-summary">
          <h3>Tóm tắt đơn hàng ({cartItems.length} sản phẩm)</h3>
          {cartItems.map(item => (
            <div className="summary-item" key={item._id}>
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="summary-img"
              />
              <div className="summary-info">
                <div>{item.name}</div>
                <div>SL: {item.quantity}</div>
              </div>
              <div className="summary-price">
                {(item.price * item.quantity).toLocaleString()} đ
              </div>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <strong>Tổng cộng</strong>
            <strong>{totalPrice.toLocaleString()} đ</strong>
          </div>
        </div>

      </div>
    </div>
  );
}