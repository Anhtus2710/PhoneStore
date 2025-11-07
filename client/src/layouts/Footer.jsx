// src/layouts/Footer.jsx
import React from "react";

// src/layouts/Footer.jsx
export default function Footer() {
  return (
    // Full-bleed: phá vỡ mọi container cha
    <footer className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white border-t border-slate-200">
      {/* Content: tăng bề rộng tối đa ở đây */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 xl:px-20 pt-10 text-sm text-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand + intro */}
          <div>
            <a href="/" className="inline-flex items-center gap-2">
              <span className="inline-grid place-items-center size-10 rounded-lg bg-indigo-600 text-white font-semibold">
                P
              </span>
              <span className="text-lg font-semibold text-gray-900">PhoneStore</span>
            </a>
            <p className="mt-6 leading-7 text-slate-500">
              PhoneStore cung cấp giao diện hiện đại, dễ tuỳ biến với Tailwind CSS cho website bán hàng.
            </p>
          </div>

          {/* Links */}
          <div className="md:mx-auto">
            <nav className="flex flex-col space-y-2.5">
              <h2 className="mb-5 text-gray-800 font-semibold">Công ty</h2>
              <a className="transition hover:text-slate-700" href="#">Về chúng tôi</a>
              <a className="transition hover:text-slate-700" href="#">
                Tuyển dụng
                <span className="ml-2 rounded-md bg-indigo-600 px-2 py-1 text-xs text-white">Đang mở!</span>
              </a>
              <a className="transition hover:text-slate-700" href="#">Liên hệ</a>
              <a className="transition hover:text-slate-700" href="#">Chính sách bảo mật</a>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="mb-5 text-gray-800 font-semibold">Đăng ký nhận tin</h2>
            <div className="max-w-md space-y-6">
              <p>Nhận tin tức, bài viết và tài nguyên mới nhất mỗi tuần.</p>
              <form
                className="flex items-center gap-2 rounded-md bg-indigo-50 p-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-slate-200 py-4 text-center text-slate-500">
          © {new Date().getFullYear()} PhoneStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
