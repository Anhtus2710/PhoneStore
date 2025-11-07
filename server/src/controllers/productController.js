// server/src/controllers/productController.js
import Product from "../models/product.js";
import slugify from "slugify";

const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true, locale: "vi" });

export const getProducts = async (req, res, next) => {
  try {
    const { category, q, featured } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };
    if (typeof featured !== "undefined") {
      filter.featured = String(featured) === "true";
    }

    const products = await Product.find(filter).populate("category", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category");
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm theo slug" });
    res.json(product);
  } catch (err) {
    console.error("❌ getProductBySlug error:", err);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm theo slug" });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.name) body.slug = makeSlug(body.name);

    // Nếu có upload file qua multer:
    if (req.file?.path) {
      body.image = req.file.path.startsWith("/") ? req.file.path : `/${req.file.path}`;
    }

    const p = await Product.create(body);
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Ảnh mới (nếu có)
    if (req.file?.path) {
      const p = req.file.path.startsWith("/") ? req.file.path : `/${req.file.path}`;
      payload.image = p;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      {
        new: true,
        runValidators: true,
        omitUndefined: true, // tránh cast "undefined"
        context: "query",
      }
    ).populate("category", "name");

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

// Featured list (max 4, newest first)
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Toggle featured (dùng cho PATCH /:id/featured)
export const setProductFeatured = async (req, res, next) => {
  try {
    const { featured } = req.body;
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { featured: !!featured },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Cập nhật sản phẩm nổi bật thành công.", product: p });
  } catch (err) {
    next(err);
  }
};
