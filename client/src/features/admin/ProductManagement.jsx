import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProducts, deleteProduct } from "../../api/adminApi";
import api from "../../api/axios"; // Dùng axios instance chung


export default function QuanLySanPham() {
  const dieuHuong = useNavigate();
  const [danhSachSanPham, datDanhSachSanPham] = useState([]);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState(null);

  // 🟢 Hàm tải danh sách sản phẩm
  const taiDanhSachSanPham = async () => {
    datDangTai(true);
    datLoi(null);
    try {
      const phanHoi = await getAdminProducts();
      datDanhSachSanPham(phanHoi.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      datLoi("Không thể tải danh sách sản phẩm.");
    } finally {
      datDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachSanPham();
  }, []);

  // 🟠 Hàm xóa sản phẩm
  const xuLyXoaSanPham = async (idSanPham) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(idSanPham);
        alert("✅ Xóa sản phẩm thành công!");
        taiDanhSachSanPham();
      } catch (err) {
        alert("❌ Lỗi khi xóa sản phẩm: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // 🟡 Hàm sửa sản phẩm
  const xuLySuaSanPham = (idSanPham) => {
    dieuHuong(`/admin/products/edit/${idSanPham}`);
  };

  // 🟢 Hàm cập nhật trạng thái nổi bật
  const xuLyToggleNoiBat = async (idSanPham, hienTai) => {
    try {
      await api.put(`/products/${idSanPham}/featured`, { featured: !hienTai });
      taiDanhSachSanPham();
    } catch (err) {
      console.error("Lỗi cập nhật nổi bật:", err);
      alert("❌ Không thể cập nhật trạng thái nổi bật!");
    }
  };

  // 🧭 Trạng thái tải dữ liệu
  if (dangTai) return <p>⏳ Đang tải danh sách sản phẩm...</p>;
  if (loi) return <p>⚠️ {loi}</p>;

  return (
    <div className="admin-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800"></h1>
        <button
          className="btn-add bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => dieuHuong("/admin/products/add")}
        >
          + Thêm sản phẩm mới
        </button>
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900 font-medium">
            <tr>
              <th className="px-4 py-3">Hình ảnh</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3 text-center">Nổi bật</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachSanPham.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            ) : (
              danhSachSanPham.map((sp) => (
                <tr
                  key={sp._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* Hình ảnh */}
                  <td className="px-4 py-3">
                    {sp.image ? (
                      <img
                        src={`http://localhost:5000${sp.image}`}
                        alt={sp.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>

                  {/* Tên sản phẩm */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {sp.name}
                  </td>

                  {/* Giá */}
                  <td className="px-4 py-3 text-indigo-600 font-semibold">
                    {(sp.price || 0).toLocaleString()} đ
                  </td>

                  {/* Checkbox nổi bật */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!sp.featured}
                      onChange={() => xuLyToggleNoiBat(sp._id, sp.featured)}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </td>

                  {/* Hành động */}
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => xuLySuaSanPham(sp._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => xuLyXoaSanPham(sp._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
