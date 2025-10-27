import React, { useState, useEffect, useRef } from "react"; // 1. Thêm useState, useEffect, useRef
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import "./mainLayout.css";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="main-layout">
      <header className="main-navbar">
        <Link to="/home" className="main-logo">
          PhoneStore
        </Link>
        <nav className="main-nav">
          <Link to="/catalog">Sản phẩm</Link>
          <Link to="/cart" className="cart-link">
            Giỏ hàng
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* 7. Cập nhật phần hiển thị user */}
          {user ? (
            <div className="user-menu-container" ref={menuRef}>
              <span className="welcome-user" onClick={toggleMenu}>
                Chào, {user.name} ▼
              </span>
              {isMenuOpen && (
                <ul className="user-dropdown-menu">
                  <li>
                    <Link to="/my-orders" onClick={handleMenuLinkClick}>
                      Đơn hàng của tôi
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={handleMenuLinkClick}>
                      Thông tin cá nhân
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link to="/admin/home" onClick={handleMenuLinkClick}>
                        Trang quản trị
                      </Link>
                    </li>
                  )}
                  <li className="logout-item">
                    <button className="btn-logout-dropdown" onClick={() => { logout(); setIsMenuOpen(false); }}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="main-footer">
        <p>© 2025 PhoneShop. Đã đăng ký bản quyền.</p>
      </footer>
    </div>
  );
}