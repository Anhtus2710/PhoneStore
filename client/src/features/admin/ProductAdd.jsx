// src/admin/ProductAdd.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getCategories } from "../../api/categoryApi";

export default function ProductAdd() {
  const navigate = useNavigate();

  // Form state
  const [images, setImages] = useState([null, null, null, null]); // up to 4 images
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [featured, setFeatured] = useState(false);

  // Data
  const [categories, setCategories] = useState([]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // success/error text
  const [error, setError] = useState(null);

  // Fetch categories once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load categories error:", err);
      }
    })();
  }, []);

  // Handle file change
  const handlePickFile = (file, index) => {
    const nextImages = [...images];
    nextImages[index] = file;
    setImages(nextImages);

    // preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const nextPreviews = [...previews];
        nextPreviews[index] = e.target.result;
        setPreviews(nextPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      const nextPreviews = [...previews];
      nextPreviews[index] = null;
      setPreviews(nextPreviews);
    }
  };

  const resetForm = () => {
    setImages([null, null, null, null]);
    setPreviews([null, null, null, null]);
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setOfferPrice("");
    setFeatured(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      // Build formData — backend của bạn đang dùng Product.image (một ảnh),
      // nên mình đính kèm ảnh đầu tiên làm ảnh chính.
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (category) formData.append("category", category);
      formData.append("price", price ? Number(price) : 0);
      if (offerPrice) formData.append("offerPrice", Number(offerPrice));
      formData.append("featured", featured ? "true" : "false");

      if (images[0]) {
        formData.append("image", images[0]); // ảnh chính
      }

      // Nếu backend chưa cấu hình upload file:
      // - Bạn cần middleware như multer để nhận field "image".
      // - Controller createProduct đọc req.file / req.body như đã có.

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Product created successfully!");
      resetForm();

      // Điều hướng về danh sách sau 1s
      setTimeout(() => navigate("/admin/products"), 800);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Failed to create product. Please check your inputs.";
      setError(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Product Image */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => {
                const inputId = `image${index}`;
                const preview = previews[index];
                return (
                  <label key={index} htmlFor={inputId} className="cursor-pointer">
                    <input
                      accept="image/*"
                      type="file"
                      id={inputId}
                      hidden
                      onChange={(e) =>
                        handlePickFile(e.target.files?.[0] || null, index)
                      }
                    />
                    {preview ? (
                      <img
                        src={preview}
                        alt={`preview-${index}`}
                        width={100}
                        height={100}
                        className="max-w-24 h-24 w-24 object-cover rounded border"
                      />
                    ) : (
                      <img
                        className="max-w-24"
                        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                        alt="uploadArea"
                        width={100}
                        height={100}
                      />
                    )}
                  </label>
                );
              })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            * Ảnh đầu tiên sẽ dùng làm ảnh chính.
          </p>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price / Offer Price */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min={0}
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              min={0}
            />
          </div>
        </div>

        {/* Featured toggle (optional) */}
        <label className="inline-flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="size-4 accent-indigo-600"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className="text-sm text-slate-700">Mark as featured</span>
        </label>

        {/* Submit */}
        <button
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "ADDING..." : "ADD"}
        </button>

        {/* Messages */}
        {message && (
          <p className="text-sm text-emerald-600 font-medium">{message}</p>
        )}
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
}
