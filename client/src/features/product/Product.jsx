import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../store/CartContext";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft } from "react-icons/fa";

export default function ProductFeature() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { cartCount, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data);
        setSelectedImage(data.image);
      } catch (err) {
        console.error("❌ Lỗi load chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert("✅ Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  // Render stars based on rating (mock rating for now)
  const renderStars = (rating = 4) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-600" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-400 font-medium">⏳ Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">⚠️ Không tìm thấy sản phẩm.</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
          >
            <FaArrowLeft />
            Quay lại danh mục
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-10">
      <div className="max-w-6xl w-full px-6 mx-auto">
        {/* Floating Cart Button */}
        <button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-blue-500/50 flex items-center justify-center transition-all transform hover:scale-110"
          onClick={() => navigate("/cart")}
          aria-label="Xem giỏ hàng"
        >
          <FaShoppingCart className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-white transition-colors">Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="hover:text-white transition-colors">{product.category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-blue-500">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft />
          Quay lại danh mục
        </Link>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mt-4">
          {/* Image Section */}
          <div className="flex gap-4 flex-1">
            {/* Thumbnail List - Hidden for now as we only have 1 image */}
            {/* You can uncomment this when you have multiple images */}
            {/* <div className="flex flex-col gap-3">
              {[product.image, product.image, product.image].map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`border ${selectedImage === image ? 'border-blue-500' : 'border-gray-700'} max-w-24 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 transition-colors`}
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              ))}
            </div> */}

            {/* Main Image */}
            <div className="border border-gray-700 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-1 max-w-2xl">
              <img
                src={`http://localhost:5000${selectedImage || product.image}`}
                alt={product.name}
                className="w-full h-full object-contain p-8 max-h-[600px]"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="text-sm w-full md:w-1/2">
            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {renderStars(4)}
              </div>
              <p className="text-base text-gray-400">(4.0)</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-700">
              {product.offerPrice && (
                <p className="text-gray-500 line-through text-base mb-1">
                  Giá gốc: {product.offerPrice.toLocaleString()}đ
                </p>
              )}
              <p className="text-3xl font-bold text-white mb-1">
                {(product.price || 0).toLocaleString()}đ
              </p>
              <span className="text-gray-500 text-sm">(Đã bao gồm VAT)</span>
            </div>

            {/* Category */}
            {product.category && (
              <div className="mb-6">
                <p className="text-gray-400 mb-2">Danh mục</p>
                <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <p className="text-base font-semibold text-white mb-3">Về sản phẩm</p>
              {product.description ? (
                <p className="text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <ul className="list-disc ml-4 text-gray-400 space-y-2">
                  <li>Chất lượng cao</li>
                  <li>Thoải mái cho sử dụng hàng ngày</li>
                  <li>Bảo hành chính hãng</li>
                </ul>
              )}
            </div>

            {/* Features/Highlights */}
            {product.featured && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-500 font-medium">⭐ Sản phẩm nổi bật</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock !== false
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {product.inStock !== false ? '✓ Còn hàng' : '✗ Hết hàng'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 text-base">
              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false}
                className="w-full py-3.5 cursor-pointer font-semibold bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600 transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.inStock === false}
                className="w-full py-3.5 cursor-pointer font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-700 space-y-3 text-sm text-gray-400">
              <p>🚚 Miễn phí vận chuyển cho đơn hàng trên 5 triệu đồng</p>
              <p>🔄 Đổi trả trong vòng 7 ngày</p>
              <p>✓ Bảo hành chính hãng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}