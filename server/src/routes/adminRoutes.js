import { Router } from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Import middleware upload
import {
  getAdminStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

const router = Router();

// Áp dụng middleware protect và admin cho TẤT CẢ các route trong file này
router.use(protect);
router.use(admin);

// == Thống kê ==
router.get("/stats", getAdminStats);

// == Quản lý Sản phẩm ==
router.get("/products", getAllProducts);

// Sử dụng route POST có middleware upload và xóa route bị trùng
router.post("/products", upload.single("image"), createProduct);

// Thêm middleware upload vào route PUT để cho phép cập nhật ảnh
router.put("/products/:id", upload.single("image"), updateProduct);

router.delete("/products/:id", deleteProduct);

// == Quản lý Người dùng ==
router.get("/users", getAllUsers); // API: GET /api/admin/users
router.put("/users/:id", updateUser); // API: PUT /api/admin/users/:id
router.delete("/users/:id", deleteUser); // API: DELETE /api/admin/users/:id

// Dòng router.post(...) bị trùng lặp ở cuối file gốc đã được xóa.

export default router;