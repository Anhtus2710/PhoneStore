import express from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);          // user tạo order
router.get("/", protect, admin, getOrders);      // admin xem tất cả order
router.get("/:id", protect, getOrderById);       // user xem order theo id

export default router;
