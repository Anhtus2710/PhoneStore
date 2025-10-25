import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "admin") {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <p>⏳ Đang xác thực quyền quản trị...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Top Header Navigation */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo" onClick={() => navigate("/admin/home")}>
            🎯 Admin Panel
          </div>
          
          <nav className="admin-nav">
            <div
              className={isActive("/admin/home") ? "active" : ""}
              onClick={() => navigate("/admin/home")}
            >
              📊 Dashboard
            </div>
            
            <div
              className={isActive("/admin/products") ? "active" : ""}
              onClick={() => navigate("/admin/products")}
            >
              📦 Sản phẩm
            </div>
            
            <div
              className={isActive("/admin/orders") ? "active" : ""}
              onClick={() => navigate("/admin/orders")}
            >
              🛒 Đơn hàng
            </div>
            
            <div
              className={isActive("/admin/users") ? "active" : ""}
              onClick={() => navigate("/admin/users")}
            >
              👤 Người dùng
            </div>
          </nav>

          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}