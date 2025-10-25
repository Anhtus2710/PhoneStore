import Product from "../models/product.js";
import slugify from "slugify";

const makeSlug = (name) =>
  slugify(name, {
    lower: true,
    strict: true,
    locale: "vi",
  });

// Lấy danh sách sản phẩm
export const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query; // nếu có query category
    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).populate("category", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết theo id
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

// Thêm mới
export const createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (body.name) {
      body.slug = makeSlug(body.name);
    }

    const p = await Product.create(body);
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

// Cập nhật
export const updateProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.name) {
      body.slug = makeSlug(body.name);
    }
    const p = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

// Xóa
export const deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category"
    );
    if (!product) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm theo slug" });
    }
    res.json(product);
  } catch (err) {
    console.error("❌ Lỗi getProductBySlug:", err);
    res.status(500).json({ message: "Lỗi server khi lấy sản phẩm theo slug" });
  }
};
