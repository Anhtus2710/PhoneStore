import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export default function CartFeature() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-800/50 backdrop-blur-sm rounded-full mb-6 border border-gray-700/50">
              <FaShoppingCart className="text-gray-600 text-6xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-400 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const shippingFee = totalPrice >= 5000000 ? 0 : 30000;
  const tax = totalPrice * 0.02;
  const finalTotal = totalPrice + shippingFee + tax;

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="flex flex-col md:flex-row max-w-6xl w-full px-6 mx-auto gap-8">
        {/* Left Column - Cart Items */}
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6 text-white">
            Giỏ hàng <span className="text-sm text-blue-500">{cartCount} sản phẩm</span>
          </h1>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-base font-medium pb-3 border-b border-gray-700">
            <p className="text-left">Chi tiết sản phẩm</p>
            <p className="text-center">Tổng phụ</p>
            <p className="text-center">Hành động</p>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] text-gray-400 items-center text-sm md:text-base font-medium pt-6 pb-6 border-b border-gray-700/50"
            >
              {/* Product Info */}
              <div className="flex items-center md:gap-6 gap-3">
                <Link
                  to={`/product/${item.slug || item._id}`}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:border-blue-500 transition-colors"
                >
                  <img
                    className="max-w-full h-full object-contain p-2"
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/product/${item.slug || item._id}`}
                    className="font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2 mb-2"
                  >
                    {item.name}
                  </Link>
                  <div className="font-normal text-gray-500">
                    <p className="mb-1">Giá: <span className="text-white font-semibold">{item.price.toLocaleString()}đ</span></p>
                    <div className="flex items-center gap-2">
                      <p>Số lượng:</p>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                        className="outline-none bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <p className="text-center text-white font-semibold mt-4 md:mt-0">
                {(item.price * item.quantity).toLocaleString()}đ
              </p>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="cursor-pointer mx-auto mt-4 md:mt-0 p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                title="Xóa sản phẩm"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path
                    d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                    stroke="#FF532E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}

          {/* Continue Shopping Button */}
          <Link
            to="/catalog"
            className="group cursor-pointer flex items-center mt-8 gap-2 text-blue-500 hover:text-blue-400 font-medium transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Right Column - Order Summary */}
        <div className="max-w-[360px] w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl md:text-2xl font-medium text-white">Tóm tắt đơn hàng</h2>
          <hr className="border-gray-700 my-5" />

          {/* Delivery Address */}
          <div className="mb-6">
            <p className="text-sm font-medium uppercase text-gray-400">Địa chỉ giao hàng</p>
            <div className="flex justify-between items-start mt-2">
              <p className="text-gray-300">Chưa có địa chỉ</p>
              <button
                onClick={() => navigate("/checkout")}
                className="text-blue-500 hover:text-blue-400 hover:underline cursor-pointer transition-colors text-sm"
              >
                Thay đổi
              </button>
            </div>

            {/* Payment Method */}
            <p className="text-sm font-medium uppercase mt-6 text-gray-400">Phương thức thanh toán</p>
            <select className="w-full border border-gray-700 bg-gray-900 text-white px-3 py-2 mt-2 outline-none rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="Online">Thanh toán online</option>
            </select>
          </div>

          <hr className="border-gray-700" />

          {/* Price Breakdown */}
          <div className="text-gray-300 mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-semibold">{totalPrice.toLocaleString()}đ</span>
            </p>
            <p className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className={shippingFee === 0 ? "text-green-400 font-semibold" : "font-semibold"}>
                {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Thuế VAT (2%)</span>
              <span className="font-semibold">{tax.toLocaleString()}đ</span>
            </p>
            <hr className="border-gray-700 my-3" />
            <p className="flex justify-between text-lg font-semibold text-white pt-2">
              <span>Tổng cộng:</span>
              <span className="text-2xl">{finalTotal.toLocaleString()}đ</span>
            </p>
          </div>

          {/* Place Order Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Đặt hàng
          </button>

          {/* Security Notice */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Thanh toán an toàn & bảo mật
          </p>
        </div>
      </div>
    </div>
  );
}