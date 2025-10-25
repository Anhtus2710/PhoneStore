import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Đăng ký
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // kiểm tra email tồn tại
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    // mã hóa mật khẩu
    const hash = await bcrypt.hash(password, 10);

    // tạo user mới
    const user = await User.create({ email, password: hash, name });

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (e) {
    next(e);
  }
};

// Đăng nhập
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    const ok = await bcrypt.compare(password, user.password);
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
