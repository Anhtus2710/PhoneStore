import React, { useState, useEffect, useRef, useCallback } from "react"; // <-- Thêm useCallback
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { FaApple, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import api from "../api/axios"; // <-- Import axios instance của bạn

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // <-- State cho gợi ý tìm kiếm
  const [showSuggestions, setShowSuggestions] = useState(false); // <-- State ẩn/hiện gợi ý

  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null); // <-- Ref cho ô tìm kiếm

  // Base URL cho API (từ biến môi trường)
  const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  // --- Logic đóng User Menu khi click ra ngoài ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Không phụ thuộc vào isUserMenuOpen nữa, luôn lắng nghe

  // --- Logic đóng Suggestions khi click ra ngoài ---
  useEffect(() => {
    function handleClickOutsideSearch(event) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  // --- Debounce cho API tìm kiếm gợi ý ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 1) { // Chỉ tìm nếu từ khóa đủ dài
        try {
          const { data } = await api.get(`/api/products/search?keyword=${searchTerm.trim()}`);
          setSuggestions(data.slice(0, 5)); // Lấy tối đa 5 gợi ý
          setShowSuggestions(true);
        } catch (error) {
          console.error("Lỗi khi fetch gợi ý:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Chạy lại khi searchTerm thay đổi

  // --- Xử lý tìm kiếm chính (khi nhấn Enter/nút) ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/catalog?q=${encodeURIComponent(searchTerm)}`); // Chuyển hướng đến trang catalog với query 'q'
    setSearchTerm("");
    setSuggestions([]); // Xóa gợi ý
    setShowSuggestions(false); // Đóng gợi ý
    setIsMobileMenuOpen(false); // Đóng menu mobile nếu đang mở
  };

  // --- Xử lý click vào một gợi ý ---
  const handleSuggestionClick = (slug) => {
    navigate(`/products/${slug}`); // Chuyển đến trang chi tiết sản phẩm
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setIsMobileMenuOpen(false); // Đóng menu mobile nếu đang mở
  };

  const handleNavLinkClick = useCallback(() => { // Sử dụng useCallback
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowSuggestions(false); // Đóng gợi ý khi click vào nav link khác
  }, []);

  const handleLogout = useCallback(() => { // Sử dụng useCallback
    logout();
    handleNavLinkClick();
    navigate("/login");
  }, [logout, handleNavLinkClick, navigate]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" onClick={handleNavLinkClick} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <FaApple className="text-white text-xl" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                PhoneStore
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                onClick={handleNavLinkClick}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/catalog"
                onClick={handleNavLinkClick}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sản phẩm
              </Link>

              {/* Search với Autocomplete (Desktop) */}
              <div ref={searchInputRef} className="relative"> {/* <-- Thêm ref */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)} // Hiện gợi ý khi focus lại
                    className="w-48 pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </form>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSuggestionClick(product.slug)}
                      >
                        <img
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <span className="text-sm text-gray-800 line-clamp-1">{product.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                onClick={handleNavLinkClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cart"
              >
                <FaShoppingBag className="text-gray-700 text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FaUser className="text-sm" />
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-200 z-50">
                      <Link
                        to="/my-orders"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Đơn hàng của tôi
                      </Link>
                      <Link
                        to="/profile"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Hồ sơ cá nhân
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={handleNavLinkClick}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Quản trị viên
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={handleNavLinkClick}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-white border-b border-gray-200 shadow-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
              {/* Mobile Search với Autocomplete */}
              <div className="relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim().length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </form>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((product) => (
                      <li
                        key={product._id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSuggestionClick(product.slug)}
                      >
                        <img
                          src={`${API_BASE_URL}${product.image}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <span className="text-sm text-gray-800 line-clamp-1">{product.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              {/* Mobile Links */}
              <Link
                to="/"
                onClick={handleNavLinkClick}
                className="block py-3 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Trang chủ
              </Link>
              <Link
                to="/catalog"
                onClick={handleNavLinkClick}
                className="block py-3 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Sản phẩm
              </Link>

              {user && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4" />
                  <Link
                    to="/my-orders"
                    onClick={handleNavLinkClick}
                    className="block py-3 text-base font-medium text-gray-700 hover:text-gray-900"
                  >
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    to="/profile"
                    onClick={handleNavLinkClick}
                    className="block py-3 text-base font-medium text-gray-700 hover:text-gray-900"
                  >
                    Hồ sơ cá nhân
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={handleNavLinkClick}
                      className="block py-3 text-base font-medium text-gray-700 hover:text-gray-900"
                    >
                      Quản trị viên
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-base font-medium text-red-600 hover:text-red-700"
                  >
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}