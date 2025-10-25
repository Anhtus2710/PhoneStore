import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/User.js";

// Import các module cần thiết để xử lý file
import fs from "fs"; // File System
import path from "path";
import { fileURLToPath } from "url";

// --- Cấu hình đường dẫn ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Đường dẫn tuyệt đối đến thư mục /uploads
const UPLOADS_DIR = path.join(__dirname, "../../uploads/");

// --- Helper: Hàm xóa file ảnh ---
const deleteImage = (imagePath) => {
  // imagePath có dạng /uploads/ten-file.png
  if (!imagePath) return;

  const filename = imagePath.split("/uploads/")[1];
  if (!filename) return;

  const fullPath = path.join(UPLOADS_DIR, filename);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Lỗi khi xóa file ảnh: ${fullPath}`, err);
    } else {
      console.log(`Đã xóa file ảnh: ${fullPath}`);
    }
  });
};

// ---------------------------------

// 📊 Lấy thống kê admin
export const getAdminStats = async (req, res) => {
  try {
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const users = await User.countDocuments();

    res.json({ revenue, orders, products, users });
  } catch (err) {
    console.error("❌ Lỗi thống kê admin:", err);
    res.status(500).json({ message: "Không thể lấy thống kê" });
  }
};

// ==============================================
//  QUẢN LÝ SẢN PHẨM
// ==============================================

// 📦 Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy sản phẩm", error });
  }
};

// ➕ Thêm sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload một hình ảnh" });
    }

    // Đường dẫn file ảnh để lưu vào DB (ví dụ: /uploads/image-123456.png)
    const imagePath = `/uploads/${req.file.filename}`;

    const exists = await Product.findOne({ slug });
    if (exists) {
      // Nếu slug tồn tại, xóa file vừa upload
      deleteImage(imagePath);
      return res.status(400).json({ message: "Slug đã tồn tại" });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      image: imagePath, // Lưu đường dẫn
      price,
      category,
    });

    res.status(201).json({ message: "Thêm sản phẩm thành công", product });
  } catch (error) {
    console.error("Lỗi createProduct:", error);
    res.status(500).json({ message: "Không thể tạo sản phẩm", error });
  }
};

// ✏️ Sửa sản phẩm (CẬP NHẬT)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body }; // Dữ liệu text từ form

    // 1. Tìm sản phẩm
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2. Kiểm tra nếu có file ảnh MỚI được upload
    if (req.file) {
      // 3. Lấy đường dẫn file mới
      const newImagePath = `/uploads/${req.file.filename}`;

      // 4. Xóa file ảnh CŨ (nếu có)
      if (product.image) {
        deleteImage(product.image);
      }

      // 5. Thêm đường dẫn ảnh MỚI vào data update
      updateData.image = newImagePath;
    }

    // 6. Cập nhật sản phẩm trong DB
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ message: "Cập nhật thành công", product: updatedProduct });
  } catch (error) {
    console.error("Lỗi updateProduct:", error);
    res.status(500).json({ message: "Không thể cập nhật sản phẩm", error });
  }
};

// ❌ Xóa sản phẩm (CẬP NHẬT)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm sản phẩm để lấy đường dẫn ảnh
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2. Xóa file ảnh (nếu có)
    if (product.image) {
      deleteImage(product.image);
    }

    // 3. Xóa sản phẩm khỏi DB
    await Product.findByIdAndDelete(id);

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Lỗi deleteProduct:", error);
    res.status(500).json({ message: "Không thể xóa sản phẩm", error });
  }
};

// ==============================================
//  QUẢN LÝ NGƯỜI DÙNG
// ==============================================

// 👤 Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không thể lấy danh sách người dùng", error });
  }
};

// 👤 Cập nhật quyền (role) của người dùng
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== "admin" && role !== "user")) {
      return res.status(400).json({ message: "Quyền không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật quyền thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật người dùng", error });
  }
};

// 👤 Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa người dùng", error });
  }
};
