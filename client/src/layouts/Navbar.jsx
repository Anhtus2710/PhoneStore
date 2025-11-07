// src/layouts/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/catalog?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavLinkClick();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <Link to="/home" onClick={handleNavLinkClick} aria-label="Home">
        <div className="flex items-center gap-2">
          <span className="inline-grid place-items-center size-10 rounded-lg bg-indigo-600 text-white font-semibold">
            P
          </span>
          <span className="text-lg font-semibold text-gray-900">
            PhoneStore
          </span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link
          to="/"
          className="hover:text-indigo-500 transition-colors font-medium"
        >
          Trang chủ
        </Link>
        <Link
          to="/catalog"
          className="hover:text-indigo-500 transition-colors font-medium"
        >
          Sản phẩm
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full"
        >
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.836 10.615 15 14.695"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                clipRule="evenodd"
                d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Cart */}
        <Link to="/cart" className="relative cursor-pointer" aria-label="Cart">
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User / Login */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            >
              Chào, {user.name}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link
                  to="/my-orders"
                  onClick={handleNavLinkClick}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đơn hàng của tôi
                </Link>
                <Link
                  to="/profile"
                  onClick={handleNavLinkClick}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Hồ sơ cá nhân
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={handleNavLinkClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Quản trị viên
                  </Link>
                )}
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Đăng nhập
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen((v) => !v)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-40`}
      >
        <Link
          to="/"
          onClick={handleNavLinkClick}
          className="block w-full py-2 px-3 hover:bg-gray-100 rounded"
        >
          Trang chủ
        </Link>
        <Link
          to="/catalog"
          onClick={handleNavLinkClick}
          className="block w-full py-2 px-3 hover:bg-gray-100 rounded"
        >
          Sản phẩm
        </Link>

        <div className="border-t border-gray-200 w-full my-2"></div>

        {user ? (
          <>
            <Link
              to="/my-orders"
              onClick={handleNavLinkClick}
              className="block w-full py-2 px-3 hover:bg-gray-100 rounded"
            >
              Đơn hàng của tôi
            </Link>
            <Link
              to="/profile"
              onClick={handleNavLinkClick}
              className="block w-full py-2 px-3 hover:bg-gray-100 rounded"
            >
              Hồ sơ cá nhân
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={handleNavLinkClick}
                className="block w-full py-2 px-3 hover:bg-gray-100 rounded"
              >
                Quản trị viên
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={handleNavLinkClick}
            className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
