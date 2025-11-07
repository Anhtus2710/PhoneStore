import { Router } from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

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

import {
  getOrders,
  searchOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.use(protect);
router.use(admin);

// ## Statistics ##
router.get("/stats", getAdminStats);

// ## Product Management ##
router.get("/products", getAllProducts);
router.post("/products", upload.single("image"), createProduct);
router.put("/products/:id", upload.single("image"), updateProduct);
router.delete("/products/:id", deleteProduct);

// ## User Management ##
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/orders", getOrders);
router.get("/orders/search", searchOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;
