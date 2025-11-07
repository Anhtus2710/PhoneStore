// src/admin/ProductList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getAdminProducts, deleteProduct } from "../../api/adminApi";

export default function ProductList() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // filters
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("createdDesc"); // createdDesc|priceAsc|priceDesc|nameAsc|nameDesc

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // load
  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getAdminProducts();
      const list = Array.isArray(res.data) ? res.data : [];
      setRows(list);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không thể tải danh sách sản phẩm");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // filter + sort client
  useEffect(() => {
    let data = [...rows];
    // search
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      data = data.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(kw) ||
          (p.category?.name || "").toLowerCase().includes(kw)
      );
    }
    // sort
    data.sort((a, b) => {
      if (sortBy === "priceAsc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceDesc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "nameAsc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "nameDesc") return (b.name || "").localeCompare(a.name || "");
      // createdDesc
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
    setFiltered(data);
    setPage(1); // reset page khi filter/sort
  }, [rows, q, sortBy]);

  // pagination slice
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // actions
  const toggleFeatured = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { featured: !current });
      // update local nhanh
      setRows((prev) =>
        prev.map((p) => (p._id === id ? { ...p, featured: !current } : p))
      );
    } catch {
      alert("Không thể cập nhật featured!");
    }
  };

  const toggleStock = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { inStock: !current });
      setRows((prev) =>
        prev.map((p) => (p._id === id ? { ...p, inStock: !current } : p))
      );
    } catch {
      alert("Không thể cập nhật tồn kho!");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await deleteProduct(id);
      setRows((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Xóa thất bại!");
    }
  };

  return (
    <div className="w-full md:p-10 p-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">All Products</h2>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý danh sách sản phẩm của cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 bg-white">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên / danh mục…"
              className="bg-transparent outline-none text-sm"
            />
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="createdDesc">Mới nhất</option>
            <option value="priceAsc">Giá: Thấp → Cao</option>
            <option value="priceDesc">Giá: Cao → Thấp</option>
            <option value="nameAsc">Tên: A → Z</option>
            <option value="nameDesc">Tên: Z → A</option>
          </select>

          <Link
            to="/admin/products/add"
            className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-indigo-700"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* table */}
      <div className="mt-6 overflow-hidden rounded-md bg-white border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-900 text-left bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">In Stock</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-slate-600">
              {loading && (
                <tr>
                  <td className="px-4 py-6" colSpan={6}>
                    ⏳ Đang tải…
                  </td>
                </tr>
              )}

              {!loading && err && (
                <tr>
                  <td className="px-4 py-6 text-red-600" colSpan={6}>
                    {err}
                  </td>
                </tr>
              )}

              {!loading && !err && pageItems.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={6}>
                    Không có sản phẩm để hiển thị.
                  </td>
                </tr>
              )}

              {!loading &&
                !err &&
                pageItems.map((p) => (
                  <tr key={p._id} className="border-t border-gray-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="border rounded overflow-hidden bg-slate-100">
                          {p.image ? (
                            <img
                              src={`http://localhost:5000${p.image}`}
                              alt={p.name}
                              className="w-16 h-16 object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 grid place-items-center text-slate-400 font-semibold">
                              {p.name?.[0] || "?"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 truncate max-w-[220px]">
                            {p.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{p.category?.name || "-"}</td>

                    <td className="px-4 py-3">
                      {(p.price || 0).toLocaleString()} đ
                    </td>

                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="size-4 accent-indigo-600"
                          checked={!!p.featured}
                          onChange={() => toggleFeatured(p._id, !!p.featured)}
                        />
                        <span className="text-xs text-slate-600">Featured</span>
                      </label>
                    </td>

                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={!!p.inStock}
                          onChange={() => toggleStock(p._id, !!p.inStock)}
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-indigo-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(p._id)}
                          className="px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* footer info */}
        {!loading && !err && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 border-t bg-slate-50 text-sm">
            <div className="text-slate-600">
              Hiển thị từ{" "}
              <b>{start + 1}</b> đến <b>{Math.min(start + pageSize, totalItems)}</b> trong tổng{" "}
              <b>{totalItems}</b> sản phẩm
            </div>
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Pagination ---------- */
function getPageNumbers(current, total, delta = 1) {
  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  if (total > 1) range.push(total);
  return Array.from(new Set(range));
}

function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  const disabledPrev = page <= 1;
  const disabledNext = page >= totalPages;
  const pages = getPageNumbers(page, totalPages, 1);

  return (
    <div className="flex items-center justify-end gap-3 w-full">
      {/* page size */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Page size</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 outline-none"
        >
          {[12, 24, 48].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* controls */}
      <button
        type="button"
        aria-label="prev"
        disabled={disabledPrev}
        onClick={() => !disabledPrev && onPageChange(page - 1)}
        className="rounded-full bg-slate-200/60 disabled:opacity-50"
        title="Trang trước"
      >
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
        </svg>
      </button>

      <div className="flex items-center gap-1.5 text-sm font-medium">
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`dots-${idx}`} className="px-1.5 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 flex items-center justify-center rounded-full transition ${
                page === p
                  ? "border border-indigo-200 text-indigo-600"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              aria-current={page === p ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        aria-label="next"
        disabled={disabledNext}
        onClick={() => !disabledNext && onPageChange(page + 1)}
        className="rounded-full bg-slate-200/60 disabled:opacity-50"
        title="Trang sau"
      >
        <svg className="rotate-180" width="36" height="36" viewBox="0 0 40 40" fill="none">
          <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="#475569" stroke="#475569" strokeWidth=".078"/>
        </svg>
      </button>
    </div>
  );
}
