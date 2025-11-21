// server/src/routes/products.js
import { Router } from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  setProductFeatured,
  searchProducts,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { sanitizeUpdate } from "../middleware/sanitizeUpdate.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = Router();

/** Public */
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.get("/:id", validateObjectId("id"), getProductById);
router.get("/search", searchProducts);

/** Admin: create / update / delete */
// Nếu có upload ảnh: dùng upload.single("image")
router.post("/", protect, admin, upload.single("image"), createProduct);
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  sanitizeUpdate,
  updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);

/** Admin: toggles riêng (an toàn, payload nhỏ) */
router.patch(
  "/:id/featured",
  protect,
  admin,
  sanitizeUpdate,
  setProductFeatured
);
router.patch(
  "/:id/stock",
  protect,
  admin,
  sanitizeUpdate,
  async (req, res, next) => {
    try {
      const Product = (await import("../models/product.js")).default;
      const doc = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { inStock: !!req.body.inStock } },
        { new: true }
      );
      if (!doc) return res.status(404).json({ message: "Product not found" });
      res.json(doc);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
