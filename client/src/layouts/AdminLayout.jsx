// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext"; // Hook lấy thông tin user & logout

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!user || user.role !== "admin") {
      logout();
      navigate("/login");
    }
  }, [user, logout, navigate]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        ⏳ Đang xác thực quyền quản trị...
      </div>
    );

  const sidebarLinks = [
    { name: "Thống kê", path: "/admin/home", icon: "🏠" },
    { name: "Sản phẩm", path: "/admin/products", icon: "📦" },
    { name: "Đơn hàng", path: "/admin/orders", icon: "🛒" },
    { name: "Người dùng", path: "/admin/users", icon: "👤" },
    { name: "Danh mục", path: "/admin/categories", icon: "🏷️" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-indigo-600">
              PhoneStore Admin
            </h1>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <span className="hidden sm:block font-medium">
              Xin chào, <span className="text-indigo-600">{user.name || "Admin"}</span>
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* --- Main layout --- */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } fixed md:static inset-y-0 left-0 z-40 w-56 md:w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col transition-transform duration-300`}
        >
          <div className="flex-1 p-4">
            <nav className="space-y-1">
              {sidebarLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-3 text-xs text-gray-500 text-center">
            v1.0 • PhoneStore
          </div>
        </aside>

        {/* Nội dung chính */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
