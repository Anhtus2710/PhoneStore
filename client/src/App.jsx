// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// --- Layouts (Khung sườn) ---
import MainLayout from "./layouts/MainLayout"; // Layout cho User
import AdminLayout from "./layouts/AdminLayout"; // Layout cho Admin

// --- Pages (User) ---
// (Bạn cần tạo các file "Page" này trong src/pages/)
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import SearchResults from './features/search/SearchResults';
// Placeholder (Tạo file ProfilePage.jsx nếu cần)
const ProfilePage = () => <div style={{ padding: '3rem', maxWidth: '1200px', margin: 'auto' }}><h1>Trang thông tin cá nhân (chưa tạo)</h1></div>;


// --- Pages (Admin) ---
// (Bạn cần tạo các file "Page" này trong src/pages/)
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminAddProductPage from "./pages/AdminAddProductPage";
import AdminEditProductPage from "./pages/AdminEditProductPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

// --- Pages (Auth - Không có Layout) ---
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      {/* --- TUYẾN ĐƯỜNG USER (Bọc trong MainLayout) --- */}
      {/* Tất cả các route bên trong này sẽ tự động có Navbar/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>

      {/* --- TUYẾN ĐƯỜNG ADMIN (Bọc trong AdminLayout) --- */}
      {/* Tất cả các route bên trong này sẽ tự động có Sidebar */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/add" element={<AdminAddProductPage />} />
        <Route path="products/edit/:id" element={<AdminEditProductPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>

      {/* --- TUYẾN ĐƯỜNG AUTH (Không có Layout) --- */}
      {/* Các trang này có giao diện toàn màn hình riêng */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- 404 Not Found --- */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}