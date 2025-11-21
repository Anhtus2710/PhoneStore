// src/controllers/authController.js
// import bcrypt from "bcryptjs"; // <-- XÓA DÒNG NÀY
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Đăng ký (ĐÃ SỬA)
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // kiểm tra email tồn tại
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    // SỬA Ở ĐÂY: Không mã hóa tại đây
    // const hash = await bcrypt.hash(password, 10); // <-- XÓA

    // tạo user mới (gửi mật khẩu plain text, model sẽ tự mã hóa)
    const user = await User.create({ email, password: password, name }); // <-- SỬA

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (e) {
    next(e);
  }
};

// Đăng nhập (ĐÃ SỬA)
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    // SỬA Ở ĐÂY: Dùng hàm 'matchPassword' của model (đã định nghĩa trong User.js)
    const ok = await user.matchPassword(password); // <-- SỬA
    if (!ok)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    // tạo JWT
    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

// Hàm lấy thông tin user (thêm vào nếu bạn chưa có)
export const me = async (req, res, next) => {
  try {
    // req.user đã được gán bởi middleware 'protect'
    if (!req.user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
    res.json(req.user);
  } catch (e) {
    next(e);
  }
};