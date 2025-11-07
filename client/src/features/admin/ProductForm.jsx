import React, { useEffect, useMemo, useState } from "react";
import { getCategories } from "../../api/categoryApi";

function isBlank(v) {
  return v === undefined || v === null || v === "" || v === "undefined" || v === "null";
}
function toNumberOrUndef(v) {
  if (isBlank(v)) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default function ProductForm({
  mode = "add",                 // "add" | "edit"
  initialData = {},             // product object khi edit
  onSubmit,                     // (formData) => Promise|void
  onCancel,                     // optional: () => void
  submitting = false,
}) {
  // form state
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(
    initialData.category?._id || initialData.category || ""
  );
  const [price, setPrice] = useState(
    initialData.price !== undefined ? String(initialData.price) : ""
  );
  const [offerPrice, setOfferPrice] = useState(
    initialData.offerPrice !== undefined ? String(initialData.offerPrice) : ""
  );
  const [featured, setFeatured] = useState(!!initialData.featured);
  const [inStock, setInStock] = useState(
    initialData.inStock === undefined ? true : !!initialData.inStock
  );

  // image
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData.image || null);

  // categories
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  // validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load categories:", e);
      } finally {
        setCatLoading(false);
      }
    })();
  }, []);

  // derived: is valid
  const isValid = useMemo(() => {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!category) next.category = "Category is required.";
    const p = toNumberOrUndef(price);
    if (p === undefined || p < 0) next.price = "Price must be a non-negative number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, category, price]);

  const onPickImage = (file) => {
    setImageFile(file || null);
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // run validation
    const _ = isValid; // triggers setErrors through useMemo
    if (!_) return;

    const fd = new FormData();

    // required / basic
    fd.append("name", name.trim());
    fd.append("category", category);

    // optional strings
    if (!isBlank(description)) fd.append("description", description.trim());

    // numbers
    const p = toNumberOrUndef(price);
    if (p !== undefined) fd.append("price", String(p));
    const op = toNumberOrUndef(offerPrice);
    if (op !== undefined) fd.append("offerPrice", String(op));

    // booleans
    fd.append("featured", featured ? "true" : "false");
    fd.append("inStock", inStock ? "true" : "false");

    // image: chỉ gửi khi user chọn ảnh mới
    if (imageFile) fd.append("image", imageFile);

    try {
      await onSubmit?.(fd);
    } catch (err) {
      // để parent xử lý, nhưng có thể thông báo ở đây nếu muốn
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg bg-white p-6 md:p-10 rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {mode === "add" ? "Add New Product" : "Edit Product"}
      </h2>

      {/* Image */}
      <div>
        <label className="block text-base font-medium mb-2 text-gray-700">
          Product Image
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onPickImage(e.target.files?.[0] || null)}
            />
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 rounded border object-cover"
              />
            ) : (
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"
                alt="upload"
                className="w-24 h-24"
              />
            )}
          </label>
          {preview && (
            <button
              type="button"
              onClick={() => onPickImage(null)}
              className="px-3 py-1.5 rounded border border-slate-300 text-sm hover:bg-slate-50"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          * If you don’t select a new image, the current one will be kept.
        </p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium" htmlFor="product-name">
          Product Name
        </label>
        <input
          id="product-name"
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`outline-none border rounded px-3 py-2.5 focus:ring-2 ${
            errors.name ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
          }`}
          required
        />
        {errors.name && (
          <span className="text-xs text-red-600">{errors.name}</span>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium" htmlFor="product-description">
          Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="outline-none border border-gray-300 rounded px-3 py-2.5 resize-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`outline-none border rounded px-3 py-2.5 focus:ring-2 ${
            errors.category ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
          }`}
          required
          disabled={catLoading}
        >
          <option value="">{catLoading ? "Loading..." : "Select category"}</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-xs text-red-600">{errors.category}</span>
        )}
      </div>

      {/* Prices */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`outline-none border rounded px-3 py-2.5 focus:ring-2 ${
              errors.price ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
            }`}
            min={0}
            required
          />
          {errors.price && (
            <span className="text-xs text-red-600">{errors.price}</span>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="offerPrice">
            Offer Price
          </label>
          <input
            id="offerPrice"
            type="number"
            placeholder="0"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="outline-none border border-gray-300 rounded px-3 py-2.5 focus:ring-2 focus:ring-indigo-500"
            min={0}
          />
          <span className="text-xs text-slate-500">
            Leave blank if not discounted.
          </span>
        </div>
      </div>

      {/* Switches */}
      <div className="flex flex-col gap-3 mt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-indigo-600"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Mark as Featured</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-indigo-600"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span className="text-sm text-gray-700">In Stock</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : mode === "add" ? "Add Product" : "Save Changes"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-slate-300 rounded font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
