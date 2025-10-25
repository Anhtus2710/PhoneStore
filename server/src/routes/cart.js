import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  syncCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect); // yêu cầu đăng nhập
router.get("/", getCart);
router.post("/", addItem);
router.put("/", updateItem);
router.delete("/:id", removeItem);
router.delete("/", clearCart);

// optional bulk sync endpoint
router.post("/sync", syncCart);

export default router;
