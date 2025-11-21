// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Thư mục lưu uploads (tạo nếu chưa có)
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // safe unique filename: timestamp + original name
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const fname = `${Date.now()}-${base}${ext}`;
    cb(null, fname);
  },
});

const fileFilter = (req, file, cb) => {
  // chỉ cho phép ảnh
  if (/image\/(jpeg|png|webp|gif|jpg)/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB mỗi file
});
