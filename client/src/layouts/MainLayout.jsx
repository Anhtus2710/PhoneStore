import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import "./mainLayout.css"; // CSS riêng cho layout

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Lấy user từ Context
  const { cartCount } = useCart(); // Lấy số lượng giỏ hàng từ Context

  return (
    <div className="main-layout">
      <header className="main-navbar">
        <Link to="/home" className="main-logo">
          PhoneShop
        </Link>
        <nav className="main-nav">
          <Link to="/catalog">Sản phẩm</Link>
          <Link to="/cart" className="cart-link">
            Giỏ hàng
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin/home" className="admin-link">
                  Quản trị
                </Link>
              )}
              <span className="welcome-user">Chào, {user.name}</span>
              <button className="btn-logout-main" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="main-footer">
        <p>© 2025 PhoneShop. Đã đăng ký bản quyền.</p>
      </footer>
    </div>
  );
}