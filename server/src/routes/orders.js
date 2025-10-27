import express from "express";
import {
  createOrder,     // Tạo đơn hàng
  getOrders,       // Admin lấy tất cả đơn hàng
  getOrderById,    // Lấy chi tiết đơn hàng theo ID
  getMyOrders,     // User lấy đơn hàng của mình
  cancelMyOrder,   // User hủy đơn hàng của mình
  updateOrderStatus // Admin cập nhật trạng thái đơn hàng
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();


router.post("/", protect, createOrder);        
router.get("/myorders", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelMyOrder); 


router.get("/:id", protect, getOrderById);     


router.get("/", protect, admin, getOrders);          
router.put("/:id/status", protect, admin, updateOrderStatus); 

export default router;