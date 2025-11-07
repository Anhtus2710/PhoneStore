import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import "./Cart.css";

export default function CartFeature() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container cart-empty">
        <h2>Giỏ hàng của bạn đang trống</h2>
        <Link to="/catalog" className="btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-layout">
        {/* Cột 1: Danh sách sản phẩm */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                src={`http://localhost:5000${item.image}`}
                alt={item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <Link to={`/product/${item._id}`} className="item-name">{item.name}</Link>
                <div className="item-price">{item.price.toLocaleString()} đ</div>
                <div className="item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="item-quantity"
                  />
                  <button onClick={() => removeFromCart(item._id)} className="btn-remove">
                    Xóa
                  </button>
                </div>
              </div>
              <div className="item-subtotal">
                {(item.price * item.quantity).toLocaleString()} đ
              </div>
            </div>
          ))}
        </div>

        {/* Cột 2: Tổng kết */}
        <div className="cart-summary">
          <h3>Tổng cộng</h3>
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{totalPrice.toLocaleString()} đ</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Thành tiền</span>
            <span>{totalPrice.toLocaleString()} đ</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-checkout">
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}