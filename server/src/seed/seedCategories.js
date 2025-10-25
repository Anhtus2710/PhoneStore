import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const categories = [
      { name: "iPhone" },
      { name: "iPad" },
      { name: "MacBook" },
      { name: "Apple Watch" },
      { name: "AirPods" },
      { name: "Phụ kiện" },
    ];

    await Category.deleteMany();
    await Category.insertMany(categories);

    console.log("✅ Seed categories thành công");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi seed:", error);
    process.exit(1);
  }
};

seedCategories();
