import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import DB connection
import connectDB from "./config.js";

// Import Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/adminRoutes.js";

// Cấu hình biến môi trường
dotenv.config();

// Cấu hình đường dẫn thư mục (cho ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = [
  'http://localhost:5173', // Frontend local
  'http://localhost:3000', // Frontend local (ví dụ)
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép request không có origin (như Postman, Mobile App) hoặc nằm trong allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Cho phép gửi cookie/header xác thực
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware xử lý dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Database
connectDB();

// --- CẤU HÌNH ROUTE ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

// --- CẤU HÌNH STATIC FILES (ẢNH) ---
// Cho phép truy cập ảnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/images", express.static(path.join(__dirname, "../images")));

// --- MIDDLEWARE XỬ LÝ LỖI ---
app.use((err, req, res, next) => {
  console.error("❌ Lỗi Server:", err.stack);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Lỗi máy chủ nội bộ (Server Error)",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));