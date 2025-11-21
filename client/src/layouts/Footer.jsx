// ===== 3. Footer.jsx =====
import React from "react";
import { Link } from "react-router-dom";
import { FaApple, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <FaApple className="text-white text-xl" />
              </div>
              <span className="text-xl font-semibold text-gray-900">PhoneStore</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Cung cấp các sản phẩm công nghệ chính hãng với chất lượng tốt nhất. 
              Trải nghiệm mua sắm hiện đại và tiện lợi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Mua sắm
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=iphone" className="text-gray-600 hover:text-gray-900 transition-colors">
                  iPhone
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=ipad" className="text-gray-600 hover:text-gray-900 transition-colors">
                  iPad
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=watch" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Apple Watch
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=accessories" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Phụ kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Công ty
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} PhoneStore. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Điều khoản
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Cookie
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}