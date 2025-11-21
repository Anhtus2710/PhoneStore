// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getCategories } from "../../api/categoryApi";
import { getFeaturedProducts } from "../../api/adminApi";
import { FaShippingFast, FaTags, FaHeadset, FaApple, FaChevronRight } from "react-icons/fa";

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
          getFeaturedProducts(8),
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
    <div className="bg-gray-900">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="mx-auto max-w-7xl">
          <div className="relative min-h-[650px] md:min-h-[750px] flex items-center justify-center px-6 py-20">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-blue-400 font-semibold text-sm">Đã ra mắt</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white">
                iPhone 17 Pro
              </h1>
              <p className="text-xl md:text-3xl mb-4 text-gray-300 font-semibold">
                Titan. Mạnh mẽ. Đẳng cấp Pro.
              </p>
              <p className="text-lg md:text-xl mb-10 text-gray-400">
                Từ 34.999.000đ hoặc 1.425.000đ/th. trong 24 tháng.*
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/catalog"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                >
                  Mua ngay
                </Link>
                <Link
                  to="/catalog"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-semibold rounded-full transition-all duration-300"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENT BAR ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-3 text-center">
          <p className="text-sm md:text-base text-white">
            <span className="font-semibold">Miễn phí giao hàng</span> cho đơn hàng trên 5.000.000đ.{" "}
            <Link to="/catalog" className="underline hover:no-underline">
              Mua sắm ngay <FaChevronRight className="inline w-3 h-3" />
            </Link>
          </p>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Khám phá những sản phẩm được yêu thích nhất
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-gray-800/50">
                <div className="h-64 bg-gray-700/50"></div>
                <div className="p-6">
                  <div className="h-4 w-3/4 bg-gray-700/50 rounded mb-3"></div>
                  <div className="h-4 w-1/2 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && errorMsg && (
          <div className="text-center py-12">
            <p className="text-red-400 font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !errorMsg && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Chưa có sản phẩm nổi bật.</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !errorMsg && featuredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p.slug}`}
                  className="group"
                >
                  <div className="rounded-3xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.name}
                        loading="lazy"
                        className="h-64 w-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Từ
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {(p.price || 0).toLocaleString()}đ
                      </p>
                      {p.offerPrice && (
                        <p className="text-sm text-gray-500 line-through mt-1">
                          {(p.offerPrice || 0).toLocaleString()}đ
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-lg group"
              >
                Xem tất cả sản phẩm
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ===== PROMO BANNER 1 ===== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="grid md:grid-cols-2 gap-8 items-center p-10 md:p-16">
              <div>
                <div className="inline-block mb-4 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white text-sm font-semibold">Mới</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                  iPad Pro
                </h2>
                <p className="text-xl md:text-2xl mb-6 text-white/90">
                  Siêu mỏng. Siêu mạnh. Siêu tiện dụng.
                </p>
                <p className="text-lg mb-8 text-white/80">
                  Từ 22.999.000đ
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/catalog"
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Mua ngay
                  </Link>
                  <Link
                    to="/catalog"
                    className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
                  >
                    Tìm hiểu thêm
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative h-64 flex items-center justify-center">
                  <FaApple className="text-white/20 text-9xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Khám phá theo danh mục
          </h2>
          <p className="text-lg text-gray-400">
            Tìm sản phẩm hoàn hảo cho bạn
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/catalog?category=${c._id}`}
              className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="aspect-square flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaApple className="text-4xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white text-center group-hover:text-blue-400 transition-colors">
                  {c.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PROMO BANNER 2 ===== */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16 md:py-24 border-y border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-blue-400 text-sm font-semibold">Sản phẩm mới</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Apple Watch Series 9
            </h2>
            <p className="text-xl md:text-2xl mb-4 text-gray-300">
              Thông minh hơn. Sáng hơn. Mạnh mẽ hơn.
            </p>
            <p className="text-lg mb-8 text-gray-400">
              Từ 10.999.000đ
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/catalog"
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all shadow-lg"
              >
                Mua ngay
              </Link>
              <Link
                to="/catalog"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACCESSORIES SECTION ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Phụ kiện
          </h2>
          <p className="text-lg text-gray-400">
            Hoàn thiện trải nghiệm của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "AirPods Pro", price: "6.499.000" },
            { name: "MagSafe Charger", price: "990.000" },
            { name: "AirTag", price: "790.000" },
            { name: "Apple Pencil", price: "2.790.000" },
          ].map((item, idx) => (
            <Link
              key={idx}
              to="/catalog"
              className="group rounded-3xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaApple className="text-white text-4xl" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xl font-bold text-white">
                  {item.price}đ
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-gray-800/50 py-16 md:py-24 border-y border-gray-700/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <Feature
              icon={<FaShippingFast />}
              title="Giao hàng miễn phí"
              desc="Miễn phí giao hàng cho đơn từ 5 triệu đồng trở lên"
            />
            <Feature
              icon={<FaTags />}
              title="Trả góp 0%"
              desc="Trả góp lãi suất 0% qua thẻ tín dụng"
            />
            <Feature
              icon={<FaHeadset />}
              title="Hỗ trợ 24/7"
              desc="Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng"
            />
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Đăng ký nhận thông tin mới nhất
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Nhận thông tin về sản phẩm mới, ưu đãi đặc biệt và các sự kiện độc quyền
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}