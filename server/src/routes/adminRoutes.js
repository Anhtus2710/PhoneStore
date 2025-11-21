// src/routes/adminRoutes.js
import { Router } from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { sanitizeUpdate } from "../middleware/sanitizeUpdate.js";

// 1. Import các hàm từ ADMIN controller (Chỉ thống kê và user)
import {
  getAdminStats,
  getRevenueChartData,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

// 2. Import các hàm từ ORDER controller
import {
  getOrders,
  searchOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

// 3. Import các hàm CRUD SẢN PHẨM từ PRODUCT controller
import {
  getAdminProducts as getAllProducts, // Dùng hàm mới
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// Áp dụng middleware bảo vệ cho TẤT CẢ các route admin
router.use(protect);
router.use(admin);

// ## Statistics ##
router.get("/stats", getAdminStats);
router.get("/stats/chart", getRevenueChartData);

// ## Product Management (Lấy từ productController) ##
router.get("/products", getAllProducts);
router.post("/products", upload.single("image"), createProduct);
router.put(
  "/products/:id",
  validateObjectId("id"),
  upload.single("image"),
  sanitizeUpdate,
  updateProduct
);
router.delete(
  "/products/:id", 
  validateObjectId("id"), 
  deleteProduct
);

// ## User Management (Lấy từ adminController) ##
router.get("/users", getAllUsers);
router.put("/users/:id", validateObjectId("id"), updateUser);
router.delete("/users/:id", validateObjectId("id"), deleteUser);

// ## Order Management (Lấy từ orderController) ##
router.get("/orders", getOrders);
router.get("/orders/search", searchOrders);
router.put(
  "/orders/:id/status", 
  validateObjectId("id"), 
  updateOrderStatus
);

export default router;