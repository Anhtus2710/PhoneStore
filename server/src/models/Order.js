// server/src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ... (user, products, total)
    shippingAddress: { // Thêm Schema chi tiết cho địa chỉ nếu muốn validation
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        street: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'COD' },
    status: {
      type: String,
      // Đảm bảo có 'cancelled'
      enum: ["pending", "paid", "shipped", "cancelled"], 
      default: "pending",
    },
    // ... (timestamps)
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);