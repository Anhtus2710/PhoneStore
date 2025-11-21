// src/features/checkout/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/CartContext"; // Dùng Cart Context
import { useAuth } from "../../hooks/useAuth"; // SỬA: Dùng Auth Hook
import { createOrder } from "../../api/orderApi"; // SỬA: Import hàm API

export default function CheckoutFeature() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin user
  const { cartItems, totalPrice, clearCart } = useCart(); // Lấy giỏ hàng

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State cho form địa chỉ (dựa trên Order.js model)
  const [form, setForm] = useState({
    fullName: user?.name || "", // Lấy tên user làm mặc định
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
  });
  
  // === THÊM STATE CHO PHƯƠNG THỨC THANH TOÁN ===
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định là COD

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // === HÀM SUBMIT ĐÃ VIẾT LẠI HOÀN CHỈNH ===
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

    // 1. Map CartItems thành OrderItems
    // Backend (orderController) chỉ cần { product, qty }
    const orderItems = cartItems.map(item => ({
      product: item._id, // item._id là productId trong CartContext
      qty: item.quantity,
    }));

    // 2. Tạo dữ liệu đơn hàng chuẩn
    const orderData = {
      shippingAddress: form,
      paymentMethod: paymentMethod, // Lấy từ state
      orderItems: orderItems,
      totalPrice: totalPrice,
    };

    try {
      // 3. SỬA: Gửi đơn hàng bằng hàm API đã import
      const { data } = await createOrder(orderData); 

      // 4. Thành công
      alert("Đặt hàng thành công! Mã đơn hàng của bạn là: " + data._id);
      clearCart(); // Xóa giỏ hàng
      navigate("/my-orders"); // Chuyển đến trang lịch sử đơn hàng

    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Sử dụng Tailwind Grid Layout
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* --- CỘT BÊN TRÁI: FORM THÔNG TIN --- */}
      <div className="md:col-span-2 space-y-6">
        
        {/* === 1. ĐỊA CHỈ GIAO HÀNG (Dùng Tailwind) === */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Thông tin giao hàng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" name="fullName" id="fullName" required onChange={onChange} value={form.fullName} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input type="tel" name="phone" id="phone" required onChange={onChange} value={form.phone} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
              <input type="text" name="province" id="province" required onChange={onChange} value={form.province} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
              <input type="text" name="district" id="district" required onChange={onChange} value={form.district} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường/Xã</label>
              <input type="text" name="ward" id="ward" required onChange={onChange} value={form.ward} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Số nhà, tên đường</label>
              <input type="text" name="street" id="street" required onChange={onChange} value={form.street} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* === 2. CHỌN PHƯƠNG THỨC THANH TOÁN (THÊM MỚI) === */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Phương thức thanh toán</h2>
          <div className="space-y-4">
            {/* Lựa chọn 1: COD */}
            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300" 
              />
              <span className="ml-3 font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</span>
            </label>

            {/* Lựa chọn 2: Online (Ví dụ) */}
            <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="PayPal" // Backend sẽ lưu chuỗi "PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-indigo-600 border-gray-300"
              />
              <span className="ml-3 font-medium text-gray-700">Thanh toán Online (PayPal / VNPay)</span>
            </label>
          </div>
        </div>

      </div>

      {/* --- CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
          <h2 className="text-xl font-semibold mb-4 border-b pb-4">Tóm tắt đơn hàng ({cartItems.length} sản phẩm)</h2>
          
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div className="summary-item flex items-center gap-4" key={item._id}>
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="summary-img w-16 h-16 rounded-md object-cover border"
                />
                <div className="summary-info flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{item.name}</div>
                  <div className="text-sm text-gray-500">SL: {item.quantity}</div>
                </div>
                <div className="summary-price font-semibold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
          <hr className="mt-4"/>
          <div className="summary-total flex justify-between text-lg font-semibold text-gray-900 mt-4">
            <strong>Tổng cộng</strong>
            <strong>{totalPrice.toLocaleString()} đ</strong>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <button type="submit" className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-md shadow-lg hover:bg-indigo-700 transition disabled:opacity-50" disabled={loading}>
            {loading ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
          </button>
        </div>
      </div>
    </form>
  );
}