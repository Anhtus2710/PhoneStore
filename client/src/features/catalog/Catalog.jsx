import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { useDebounce } from "../../hooks/useDebounce";

/* --- Helper đọc query string từ URL --- */
function useQueryString() {
  return new URLSearchParams(useLocation().search);
}

export default function Catalog() {
  const qs = useQueryString();
  const navigate = useNavigate();

  // Lấy filter từ URL
  const initialCategory = qs.get("category") || "all";
  const initialSearch = qs.get("q") || "";
  const initialSort = qs.get("sort") || "latest";

  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Loading/error
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- Đồng bộ URL ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (searchTerm) params.set("q", searchTerm);
    if (sortBy !== "latest") params.set("sort", sortBy);
    navigate({ search: params.toString() ? `?${params}` : "" }, { replace: true });
  }, [category, searchTerm, sortBy, navigate]);

  // --- Fetch danh mục ---
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    })();
  }, []);

  // --- Fetch sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data } = await getProducts(category, debouncedSearch);
        const list = Array.isArray(data) ? data : [];

        // Sort client
        const sorted = [...list].sort((a, b) => {
          if (sortBy === "priceAsc") return (a.price || 0) - (b.price || 0);
          if (sortBy === "priceDesc") return (b.price || 0) - (a.price || 0);
          const da = new Date(a.createdAt).getTime() || 0;
          const db = new Date(b.createdAt).getTime() || 0;
          return db - da;
        });
        setProducts(sorted);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, debouncedSearch, sortBy]);

  // Reset page khi thay đổi filter
  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch, sortBy, pageSize]);

  // Pagination client-side
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = products.slice(start, start + pageSize);

  // Heading
  const heading = useMemo(() => {
    if (searchTerm) return `Kết quả cho "${searchTerm}"`;
    if (category !== "all") {
      const cat = categories.find((c) => c._id === category);
      return cat ? `Danh mục: ${cat.name}` : "Danh sách sản phẩm";
    }
    return "Danh sách sản phẩm";
  }, [searchTerm, category, categories]);

  return (
    <div className="bg-white min-h-screen">
      {/* --- Bộ lọc --- */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{heading}</h1>
            <p className="mt-2 text-slate-600">Tìm và chọn sản phẩm phù hợp nhất cho bạn.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
            {/* Category */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Danh mục</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">Tất cả</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Search */}
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Tìm kiếm</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên sản phẩm…"
                  className="w-full bg-transparent outline-none text-sm"
                />
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </label>

            {/* Sort */}
            <label className="hidden sm:block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Sắp xếp</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="latest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp → Cao</option>
                <option value="priceDesc">Giá: Cao → Thấp</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* --- Danh sách sản phẩm --- */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        {/* Loading */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-56 bg-slate-200" />
                <div className="p-5">
                  <div className="h-4 w-2/3 bg-slate-200 rounded mb-3" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && errorMsg && (
          <div className="mt-10 text-center text-red-500 font-semibold">{errorMsg}</div>
        )}

        {/* Empty */}
        {!loading && !errorMsg && products.length === 0 && (
          <div className="mt-10 text-center text-slate-500">
            {searchTerm
              ? "Không tìm thấy sản phẩm nào khớp với từ khóa của bạn."
              : "Không có sản phẩm nào trong danh mục này."}
          </div>
        )}

        {/* Grid */}
        {!loading && !errorMsg && products.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pageItems.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="group block rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="relative overflow-hidden">
                    {p.image ? (
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.name}
                        loading="lazy"
                        className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-64 w-full grid place-items-center bg-slate-100 text-3xl font-bold text-slate-400">
                        {(p.name || "").charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xl font-bold text-indigo-600">
                      {(p.price || 0).toLocaleString()} đ
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- Pagination --- */}
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}

/* --- Pagination Component --- */
function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10">
      {/* Page size */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Hiển thị</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600"
        >
          {[12, 24, 48].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>sản phẩm/trang</span>
      </div>

      {/* Nút trang */}
      <div className="flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full bg-slate-200/50 p-2 disabled:opacity-50"
        >
          ←
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-10 w-10 flex items-center justify-center rounded-full transition ${
                page === p
                  ? "border border-indigo-200 text-indigo-600 font-semibold"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full bg-slate-200/50 p-2 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}

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
