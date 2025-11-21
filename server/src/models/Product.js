import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    featured: { type: Boolean, default: false },
    variants: [{ name: String, color: String, image: String }],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

// Fix OverwriteModelError: chỉ tạo mới nếu chưa có
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
