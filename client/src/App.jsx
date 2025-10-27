import { Routes, Route, Navigate } from "react-router-dom";


import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage"; // Trang chi tiết sản phẩm
import CartPage from "./pages/CartPage";     // Trang giỏ hàng
import CheckoutPage from "./pages/CheckoutPage"; // Trang thanh toán
import RegisterPage from "./pages/RegisterPage"; // Trang đăng ký
import LoginPage from "./pages/LoginPage";     // Trang đăng nhập
import OrderDetailPage from "./pages/OrderDetailPage";

import AdminDashboardPage from "./pages/AdminDashboardPage"; // Bảng điều khiển
import AdminProductsPage from "./pages/AdminProductsPage";   // Quản lý sản phẩm
import AdminAddProductPage from "./pages/AdminAddProductPage";    // Thêm sản phẩm
import AdminEditProductPage from "./pages/AdminEditProductPage";   // Sửa sản phẩm
import AdminUsersPage from "./pages/AdminUsersPage";       // Quản lý người dùng
import AdminOrdersPage from "./pages/AdminOrdersPage";      // Quản lý đơn hàng

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/:id" element={<OrderDetailPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
      <Route path="/admin/home" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/add" element={<AdminAddProductPage />} />
      <Route path="/admin/products/edit/:id" element={<AdminEditProductPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />

      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>
  );
}