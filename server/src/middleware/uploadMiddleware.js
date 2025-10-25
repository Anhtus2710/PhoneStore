import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại (vì dùng ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình nơi lưu trữ file
const storage = multer.diskStorage({
  // Định nghĩa thư mục đích
  destination: (req, file, cb) => {
    // Lưu vào thư mục 'uploads' ở ngoài thư mục 'src'
    cb(null, path.join(__dirname, "../../uploads/")); 
  },
  // Định nghĩa tên file
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Cấu hình multer
const upload = multer({
  storage: storage,
  // Thêm bộ lọc file (tùy chọn, nhưng nên có)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Lỗi: Chỉ cho phép upload file ảnh (jpeg, jpg, png, gif)!");
  },
});

export default upload;