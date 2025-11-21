// src/features/search/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios'; // Đảm bảo đường dẫn đúng đến axios instance của bạn
import ProductCard from '../product/ProductCard'; // Sử dụng lại ProductCard của bạn

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!keyword) {
                setProducts([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const { data } = await api.get(`/api/products/search?keyword=${keyword}`);
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi fetch kết quả tìm kiếm:", err);
                if (err.response && err.response.status === 404) {
                    setError("Không tìm thấy sản phẩm nào phù hợp.");
                    setProducts([]); // Đảm bảo xóa sản phẩm cũ nếu không tìm thấy
                } else {
                    setError("Đã xảy ra lỗi khi tải kết quả tìm kiếm.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [keyword]); // Chạy lại khi keyword thay đổi

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6">
                Kết quả tìm kiếm cho: "<span className="text-blue-600">{keyword}</span>"
            </h2>

            {loading && <p>Đang tải kết quả...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && products.length === 0 && (
                <p>Không có sản phẩm nào phù hợp với từ khóa của bạn.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;