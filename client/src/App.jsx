import { Routes, Route, Navigate } from "react-router-dom";

// Import các trang User
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
// Import các trang Admin
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminAddProductPage from "./pages/AdminAddProductPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";


export default function App() {
  return (
    <Routes>
      {/* Trang người dùng */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Trang quản trị */}
      <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
      <Route path="/admin/home" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/add" element={<AdminAddProductPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}