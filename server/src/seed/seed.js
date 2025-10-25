import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Kiểm tra nếu admin đã tồn tại
    const exists = await User.findOne({ email: "admin@phone.vn" });
    if (exists) {
      console.log("⚠️ Admin đã tồn tại");
      process.exit(0);
    }

    // Hash password
    const hash = await bcrypt.hash("admin", 10);

    // Tạo admin
    await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: hash,
      role: "admin",   
    });

    console.log("✅ Admin account created: admin@gmail.com / admin");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed admin error:", err);
    process.exit(1);
  }
};

seedAdmin();
