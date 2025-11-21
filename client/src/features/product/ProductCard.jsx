// D:/tu/phonestore/client/src/features/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Đảm bảo lấy base URL từ biến môi trường
  const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  // Xử lý đường dẫn ảnh (để đảm bảo ảnh luôn có tiền tố domain)
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `${API_BASE_URL}${product.image}`;

  return (
    <Link
      to={`/products/${product.slug}`} // Chắc chắn dùng product.slug nếu có, hoặc product._id
      className="group block rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Hiệu ứng hover tối màu nhẹ (tùy chọn) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 text-center">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        {/* Nếu bạn có category, có thể hiển thị: */}
        {/* {product.category && <p className="text-sm text-gray-500">{product.category.name}</p>} */}
        <p className="mt-1 text-xl font-bold text-indigo-600">
          {(product.price || 0).toLocaleString()} đ
        </p>
      </div>
    </Link>
  );
}