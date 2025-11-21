// routes/upload.js
import express from "express";
import { upload } from "../middlewares/upload.js";
const router = express.Router();

// single file upload -> field name: 'file'
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // trả về đường dẫn có thể truy cập từ frontend
  // giả sử server chạy ở http://localhost:5000
  const url = `/uploads/${req.file.filename}`;
  return res.json({ url });
});

export default router;
