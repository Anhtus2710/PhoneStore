import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Product from "../models/product.js";
import Category from "../models/category.js";

dotenv.config();

const products = [
  // ======== Các sản phẩm hiện có ========
  {
    name: "iPhone 15 Pro Max 256GB",
    price: 33990000,
    description: "Siêu phẩm iPhone 15 Pro Max mới nhất",
    categoryName: "iPhone",
    image: "/images/iphone15promax.png",
  },
  {
    name: "iPad Pro 12.9 M2",
    price: 28990000,
    description: "Máy tính bảng iPad Pro chip M2 mạnh mẽ",
    categoryName: "iPad",
    image: "/images/ipadpro.png",
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    price: 52990000,
    description: "MacBook Pro chip M3 Pro hiệu năng khủng",
    categoryName: "MacBook",
    image: "/images/macbookpro14.png",
  },
  {
    name: "Apple Watch Ultra 2",
    price: 22990000,
    description: "Đồng hồ thông minh mạnh mẽ nhất của Apple",
    categoryName: "Watch",
    image: "/images/applewatchultra2.png",
  },
  {
    name: "AirPods Pro 2",
    price: 5490000,
    description: "Tai nghe không dây chống ồn hàng đầu",
    categoryName: "AirPods",
    image: "/images/airpodspro2.png",
  },
  {
    name: "Ốp lưng MagSafe iPhone 15",
    price: 1290000,
    description: "Ốp lưng chính hãng Apple với MagSafe",
    categoryName: "Phụ kiện",
    image: "/images/oplungmagsafe.png",
  },

  // ======== 🌟 iPhone 17 Series mới nhất 🌟 ========
  {
    name: "iPhone 17 128GB",
    price: 24990000,
    description: "iPhone 17 với thiết kế mỏng nhẹ, hiệu năng mạnh mẽ từ chip A19 Bionic",
    categoryName: "iPhone",
    image: "/images/iphone17.png",
  },
  {
    name: "iPhone 17 Plus 256GB",
    price: 27990000,
    description: "Màn hình lớn hơn, pin lâu hơn cùng hiệu năng vượt trội với chip A19 Bionic",
    categoryName: "iPhone",
    image: "/images/iphone17plus.png",
  },
  {
    name: "iPhone 17 Pro 256GB",
    price: 34990000,
    description: "Cụm camera nâng cấp với cảm biến mới, thiết kế Titanium sang trọng",
    categoryName: "iPhone",
    image: "/images/iphone17pro.png",
  },
  {
    name: "iPhone 17 Pro Max 512GB",
    price: 42990000,
    description: "Phiên bản cao cấp nhất của iPhone 17 Series với hiệu năng cực đỉnh",
    categoryName: "iPhone",
    image: "/images/iphone17promax.png",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Đã kết nối MongoDB");

    for (let p of products) {
      // --- Kiểm tra / tạo Category ---
      let category = await Category.findOne({ name: p.categoryName });
      if (!category) {
        const slug = slugify(p.categoryName, { lower: true, strict: true });
        category = await Category.create({ name: p.categoryName, slug });
        console.log(`🆕 Tạo mới Category: ${p.categoryName}`);
      }

      // --- Tạo slug sản phẩm ---
      const slug = slugify(p.name, { lower: true, strict: true });

      // --- Upsert sản phẩm (update nếu có slug, ngược lại tạo mới) ---
      await Product.updateOne(
        { slug },
        {
          $set: {
            name: p.name,
            price: p.price,
            description: p.description,
            image: p.image,
            category: category._id,
            slug,
          },
        },
        { upsert: true }
      );

      console.log(`✅ Seed/Update thành công: ${p.name}`);
    }

    console.log("🎉 Hoàn tất seed sản phẩm (bao gồm iPhone 17 Series)");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
};

seedProducts();
