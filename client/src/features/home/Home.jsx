// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios"; // nếu không dùng thì có thể xóa
import { getCategories } from "../../api/categoryApi";
import { getFeaturedProducts } from "../../api/adminApi";

import { FaShippingFast, FaTags, FaHeadset } from "react-icons/fa";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const [catRes, featRes] = await Promise.all([
          getCategories(),
          getFeaturedProducts(8), // tăng lên 8 cho grid đẹp
        ]);
        setCategories((catRes.data || []).slice(0, 6));
        setFeaturedProducts(featRes.data || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Không thể tải dữ liệu trang chủ.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white text-slate-900">
      {/* ===== HERO ===== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-24">
          {/* background blob */}
          <div className="absolute inset-x-0 -top-24 -z-10 blur-3xl opacity-40">
            <div className="mx-auto h-72 w-2/3 rotate-6 bg-gradient-to-tr from-indigo-400 via-indigo-500 to-purple-500 rounded-full" />
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white px-6 py-16 md:px-16 md:py-24 shadow-2xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium tracking-wide">
                PhoneStore
              </span>
              <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
                Nâng tầm trải nghiệm di động
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/90">
                Khám phá những sản phẩm mới nhất, thiết kế tinh tế, hiệu năng vượt trội.
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Link
                  to="/catalog"
                  className="rounded-full bg-white text-indigo-600 font-semibold px-6 py-3 shadow hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  Mua sắm ngay
                </Link>
                <Link
                  to="/catalog?sort=latest"
                  className="rounded-full border-2 border-white/90 text-white font-semibold px-6 py-3 hover:bg-white hover:text-indigo-600 transition"
                >
                  Xem hàng mới
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Sản phẩm nổi bật</h2>
          <p className="mt-3 text-slate-600">
            Những lựa chọn được admin tuyển chọn kỹ càng cho bạn.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
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

        {/* Error state */}
        {!isLoading && errorMsg && (
          <div className="mt-10 text-center text-red-500 font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !errorMsg && featuredProducts.length === 0 && (
          <div className="mt-10 text-center text-slate-500">
            Chưa có sản phẩm nổi bật. Hãy vào trang Admin để chọn.
          </div>
        )}

        {/* Grid products */}
        {!isLoading && !errorMsg && featuredProducts.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="group block rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt={p.name}
                      loading="lazy"
                      className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

            <div className="mt-12 text-center">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 transition"
              >
                Xem tất cả sản phẩm
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Danh mục sản phẩm</h2>
          <p className="mt-3 text-slate-600">Chọn nhanh theo nhu cầu của bạn.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/catalog?category=${c._id}`}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 hover:-translate-y-1 hover:shadow-lg transition group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                  {c.name}
                </h3>
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent group-hover:translate-x-1 transition">
                  Xem ngay →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 text-white p-10 md:p-14 shadow-xl">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold">Ưu đãi đặc biệt mùa hè!</h2>
            <p className="mt-2 text-white/90">Giảm giá đến 30% cho phụ kiện chọn lọc.</p>
            <Link
              to="/catalog"
              className="mt-6 inline-block rounded-full border-2 border-white/90 px-6 py-2 font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Xem khuyến mãi
            </Link>
          </div>
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>
      </section>

      {/* ===== STORE FEATURES ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-10">
          <Feature
            icon={<FaShippingFast />}
            title="Giao hàng toàn quốc"
            desc="Nhanh chóng, tiện lợi, miễn phí cho đơn lớn."
          />
          <Feature
            icon={<FaTags />}
            title="Ưu đãi hấp dẫn"
            desc="Luôn cập nhật khuyến mãi & giá tốt."
          />
          <Feature
            icon={<FaHeadset />}
            title="Hỗ trợ tận tâm"
            desc="Tư vấn 24/7 sẵn sàng đồng hành."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl shadow-md">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  );
}
