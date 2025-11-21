import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { useDebounce } from "../../hooks/useDebounce";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";

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
    <div className="bg-gray-900 min-h-screen">
      {/* --- Bộ lọc --- */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{heading}</h1>
            <p className="mt-2 text-gray-400">Tìm và chọn sản phẩm phù hợp nhất cho bạn.</p>
            {!loading && products.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
               
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
                <FaFilter className="text-blue-400" />
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
                <FaSearch className="text-blue-400" />
                Tìm kiếm
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
                <FaSortAmountDown className="text-blue-400" />
                Sắp xếp
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="latest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp → Cao</option>
                <option value="priceDesc">Giá: Cao → Thấp</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* --- Danh sách sản phẩm --- */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        {/* Loading */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-gray-800/50 border border-gray-700/50">
                <div className="h-64 bg-gray-700/50" />
                <div className="p-6">
                  <div className="h-4 w-2/3 bg-gray-700/50 rounded mb-3" />
                  <div className="h-4 w-1/3 bg-gray-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && errorMsg && (
          <div className="mt-10 text-center">
            <div className="inline-block px-6 py-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 font-semibold">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !errorMsg && products.length === 0 && (
          <div className="mt-10 text-center py-16">
            <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
              <FaSearch className="text-gray-600 text-4xl" />
            </div>
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? `Không tìm thấy sản phẩm nào khớp với "${searchTerm}"`
                : "Không có sản phẩm nào trong danh mục này"}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !errorMsg && products.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pageItems.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="group"
                >
                  <div className="rounded-3xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      {p.image ? (
                        <img
                          src={`http://localhost:5000${p.image}`}
                          alt={p.name}
                          loading="lazy"
                          className="h-64 w-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-64 w-full grid place-items-center text-6xl font-bold text-gray-700">
                          {(p.name || "").charAt(0)}
                        </div>
                      )}
                      
                      {/* Badges */}
                      {p.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-yellow-900 text-xs font-semibold rounded-full">
                            Nổi bật
                          </span>
                        </div>
                      )}
                      
                      {p.offerPrice && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            Giảm giá
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-bold text-white">
                          {(p.price || 0).toLocaleString()}đ
                        </p>
                        {p.offerPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {(p.offerPrice || 0).toLocaleString()}đ
                          </p>
                        )}
                      </div>
                      
                      {/* Category badge */}
                      {p.category && (
                        <div className="mt-3">
                          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                            {p.category.name}
                          </span>
                        </div>
                      )}
                    </div>
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-12 pt-8 border-t border-gray-800">
      {/* Page size */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>Hiển thị</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg bg-gray-800 border border-gray-700 text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ←
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} className="text-gray-600 px-2">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                page === p
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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