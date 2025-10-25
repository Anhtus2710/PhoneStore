// src/controllers/categoryController.js
import Category from "../models/category.js";

// Lấy tất cả categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Tạo mới category
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    // kiểm tra đã tồn tại chưa
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category đã tồn tại" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// Cập nhật category theo id
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Xóa category theo id
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    res.json({ message: "Xóa category thành công" });
  } catch (err) {
    next(err);
  }
};
