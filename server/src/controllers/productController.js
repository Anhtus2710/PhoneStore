// server/src/controllers/productController.js
import Product from "../models/product.js";
import slugify from "slugify";

// Import các module cần thiết để xử lý file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Cấu hình đường dẫn ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../uploads/");

// --- Helper: Hàm xóa file ảnh ---
const deleteImage = (imagePath) => {
  if (!imagePath) return;
  const filename = imagePath.split("/uploads/")[1];
  if (!filename) return;
  const fullPath = path.join(UPLOADS_DIR, filename);

  fs.unlink(fullPath, (err) => {
    if (err) console.error(`Lỗi khi xóa file ảnh: ${fullPath}`, err);
    else console.log(`Đã xóa file ảnh: ${fullPath}`);
  });
};

// --- Helper: Tạo slug ---
const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true, locale: "vi" });

// ==============================================
//  PUBLIC GETTERS (Công khai)
// ==============================================

export const getProducts = async (req, res, next) => {
  try {
    const { category, q, featured } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (q) filter.name = { $regex: q, $options: "i" };
    if (typeof featured !== "undefined") {
      filter.featured = String(featured) === "true";
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category"
    );
    if (!product)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm theo slug" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Lấy sản phẩm nổi bật (cho trang chủ)
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const products = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("category", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ==============================================
//  ADMIN CRUD (Quản trị)
// ==============================================

// Lấy tất cả sản phẩm (cho trang admin)
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Tạo sản phẩm
export const createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.name) body.slug = makeSlug(body.name);

    // Xử lý ảnh
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload một hình ảnh" });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    body.image = imagePath;

    // Kiểm tra slug
    const exists = await Product.findOne({ slug: body.slug });
    if (exists) {
      deleteImage(imagePath); // Xóa ảnh đã tải lên nếu slug trùng
      return res.status(400).json({ message: "Slug đã tồn tại" });
    }

    const p = await Product.create(body);
    res.status(201).json(p);
  } catch (err) {
    // Nếu lỗi, xóa ảnh đã tải lên
    if (req.file) {
      deleteImage(`/uploads/${req.file.filename}`);
    }
    next(err);
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // 1. Tìm sản phẩm
    const product = await Product.findById(id);
    if (!product) {
      if (req.file) deleteImage(`/uploads/${req.file.filename}`); // Xóa ảnh mới nếu lỡ upload
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2. Cập nhật slug nếu tên thay đổi
    if (updateData.name) {
      updateData.slug = makeSlug(updateData.name);
    }

    // 3. Xử lý ảnh MỚI (nếu có)
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;
      // Xóa ảnh CŨ
      if (product.image) {
        deleteImage(product.image);
      }
      // Thêm ảnh MỚI
      updateData.image = newImagePath;
    }

    // 4. Cập nhật vào DB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData }, // Dùng $set để tránh ghi đè "undefined"
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      }
    ).populate("category", "name");

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Xóa ảnh trước
    if (p.image) {
      deleteImage(p.image);
    }

    // Xóa khỏi DB
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

// Đặt/hủy sản phẩm nổi bật
export const setProductFeatured = async (req, res, next) => {
  try {
    const { featured } = req.body;

    if (typeof featured !== "boolean") {
      return res
        .status(400)
        .json({ message: "Trạng thái 'featured' (boolean) là bắt buộc" });
    }

    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { featured: featured },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Cập nhật thành công", product: p });
  } catch (err) {
    next(err);
  }
};
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword, // Tìm kiếm một phần của tên
            $options: "i", // Không phân biệt chữ hoa chữ thường
          },
        }
      : {}; // Nếu không có keyword, trả về rỗng (có thể trả về tất cả sản phẩm hoặc lỗi)

    const products = await Product.find({ ...keyword }).populate(
      "category",
      "name"
    ); // Lấy thêm tên category

    if (products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nào." });
    }

    res.json(products);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi tìm kiếm sản phẩm." });
  }
};
