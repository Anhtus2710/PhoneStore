import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  qty: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
});
const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' 
    },

    products: [orderItemSchema], 
    total: { 
      type: Number,
      required: true,
      default: 0.0
    },
    shippingAddress: { 
      type: {
          fullName: { type: String, required: true },
          phone: { type: String, required: true },
          province: { type: String, required: true },
          district: { type: String, required: true },
          ward: { type: String, required: true },
          street: { type: String, required: true },
      },
      required: true 
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },
    status: { 
      type: String,
      required: true,
      enum: ["pending", "paid", "shipped", "cancelled"], 
      default: "pending",
    },
  },
  { timestamps: true } 
);
export default mongoose.model("Order", orderSchema);