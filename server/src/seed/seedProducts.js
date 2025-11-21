// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Product from "../models/Product.js";
import Category from "../models/category.js";

dotenv.config();

// Helper tạo URL placeholder ảnh đẹp cho một product + variant
// Dùng picsum.photos với seed để ảnh nhất quán mỗi lần gọi
const makePlaceholderImage = (slug, variantName, w = 800, h = 800) => {
  const seed = encodeURIComponent(`${slug}-${variantName}`);
  // kích thước 800x800, đồng nhất, hiệu ứng blur nhẹ bằng query ?blur=1 (picsum hỗ trợ)
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

// Một số màu phổ biến để tạo variant (tên + hex)
const commonColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Blue", hex: "#0A84FF" },
  { name: "Purple", hex: "#6E4CFF" },
  { name: "Red", hex: "#FF3B30" },
  { name: "Green", hex: "#34C759" },
];

// Mảng sản phẩm chính (giữ như trước nhưng thêm variants sẽ được sinh tự động)
const baseProducts = [
  {
    name: "iPhone 15 Pro Max 256GB",
    price: 33990000,
    description: "Siêu phẩm iPhone 15 Pro Max mới nhất",
    categoryName: "iPhone",
    image: "/images/iphone15promax.png",
    // optional: preset variant color names to prefer
    preferredColors: ["Black", "Silver", "Gold"],
  },
  {
    name: "iPad Pro 12.9 M2",
    price: 28990000,
    description: "Máy tính bảng iPad Pro chip M2 mạnh mẽ",
    categoryName: "iPad",
    image: "/images/ipadpro.png",
    preferredColors: ["Silver", "Space Gray"],
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    price: 52990000,
    description: "MacBook Pro chip M3 Pro hiệu năng khủng",
    categoryName: "MacBook",
    image: "/images/macbookpro14.png",
    preferredColors: ["Silver", "Space Gray"],
  },
  {
    name: "Apple Watch Ultra 2",
    price: 22990000,
    description: "Đồng hồ thông minh mạnh mẽ nhất của Apple",
    categoryName: "Watch",
    image: "/images/applewatchultra2.png",
    preferredColors: ["Black", "Silver"],
  },
  {
    name: "AirPods Pro 2",
    price: 5490000,
    description: "Tai nghe không dây chống ồn hàng đầu",
    categoryName: "AirPods",
    image: "/images/airpodspro2.png",
    preferredColors: ["White"],
  },
  {
    name: "Ốp lưng MagSafe iPhone 15",
    price: 1290000,
    description: "Ốp lưng chính hãng Apple với MagSafe",
    categoryName: "Phụ kiện",
    image: "/images/oplungmagsafe.png",
    preferredColors: ["Black", "Blue", "Red"],
  },

  // iPhone 17 Series
  {
    name: "iPhone 17 128GB",
    price: 24990000,
    description:
      "iPhone 17 với thiết kế mỏng nhẹ, hiệu năng mạnh mẽ từ chip A19 Bionic",
    categoryName: "iPhone",
    image: "/images/iphone17.png",
    preferredColors: ["Black", "Blue", "Purple", "White"],
  },
  {
    name: "iPhone 17 Plus 256GB",
    price: 27990000,
    description:
      "Màn hình lớn hơn, pin lâu hơn cùng hiệu năng vượt trội với chip A19 Bionic",
    categoryName: "iPhone",
    image: "/images/iphone17plus.png",
    preferredColors: ["Black", "Blue", "Gold"],
  },
  {
    name: "iPhone 17 Pro 256GB",
    price: 34990000,
    description:
      "Cụm camera nâng cấp với cảm biến mới, thiết kế Titanium sang trọng",
    categoryName: "iPhone",
    image: "/images/iphone17pro.png",
    preferredColors: ["Titanium", "Black", "Silver"],
  },
  {
    name: "iPhone 17 Pro Max 512GB",
    price: 42990000,
    description:
      "Phiên bản cao cấp nhất của iPhone 17 Series với hiệu năng cực đỉnh",
    categoryName: "iPhone",
    image: "/images/iphone17promax.png",
    preferredColors: ["Titanium", "Gold", "Black"],
  },

  // Dòng Apple 2025 mở rộng
  {
    name: "iPhone SE 4 128GB",
    price: 15990000,
    description: "iPhone SE thế hệ thứ 4 với Face ID và chip A18 mạnh mẽ.",
    categoryName: "iPhone",
    image: "/images/iphonese4.png",
    preferredColors: ["White", "Black", "Red"],
  },
  {
    name: "MacBook Air 13 M3",
    price: 28990000,
    description:
      "Mỏng, nhẹ, mạnh mẽ với chip Apple M3 và thời lượng pin lên đến 18 giờ.",
    categoryName: "MacBook",
    image: "/images/macbookairm3.png",
    preferredColors: ["Silver", "Gold"],
  },
  {
    name: "MacBook Pro 16 M3 Max",
    price: 72990000,
    description:
      "Hiệu năng khủng cho dân chuyên nghiệp với GPU M3 Max cực mạnh.",
    categoryName: "MacBook",
    image: "/images/macbookpro16m3max.png",
    preferredColors: ["Space Gray", "Silver"],
  },
  {
    name: "iPad Pro 13 M4",
    price: 34990000,
    description: "iPad Pro mới nhất với chip M4 và màn hình OLED rực rỡ.",
    categoryName: "iPad",
    image: "/images/ipadprom4.png",
    preferredColors: ["Silver", "Space Gray"],
  },
  {
    name: "iPad Air 11 M2",
    price: 19990000,
    description: "iPad Air với chip M2 và hỗ trợ Apple Pencil Pro.",
    categoryName: "iPad",
    image: "/images/ipadairm2.png",
    preferredColors: ["Blue", "Starlight"],
  },
  {
    name: "Apple Watch Series 10",
    price: 14990000,
    description: "Thiết kế mỏng hơn, cảm biến sức khỏe mới, pin lâu hơn.",
    categoryName: "Watch",
    image: "/images/applewatchseries10.png",
    preferredColors: ["Silver", "Black", "Gold"],
  },
  {
    name: "Apple Watch SE (2025)",
    price: 8990000,
    description: "Tính năng cốt lõi của Apple Watch với giá dễ tiếp cận.",
    categoryName: "Watch",
    image: "/images/applewatchse2025.png",
    preferredColors: ["Black", "White"],
  },
  {
    name: "AirPods 4",
    price: 4590000,
    description: "Tai nghe AirPods thế hệ thứ 4 với Adaptive Audio và USB-C.",
    categoryName: "AirPods",
    image: "/images/airpods4.png",
    preferredColors: ["White"],
  },
  {
    name: "AirPods Max 2",
    price: 13990000,
    description: "Tai nghe chụp tai cao cấp nhất với chip H2 và Bluetooth 5.4.",
    categoryName: "AirPods",
    image: "/images/airpodsmax2.png",
    preferredColors: ["Silver", "Black"],
  },
  {
    name: "Apple Pencil Pro",
    price: 4990000,
    description: "Bút cảm ứng thế hệ mới hỗ trợ cảm biến lực và xoay.",
    categoryName: "Phụ kiện",
    image: "/images/applepencilpro.png",
    preferredColors: ["White"],
  },
  {
    name: "Magic Keyboard iPad Pro M4",
    price: 8990000,
    description:
      "Magic Keyboard mới với trackpad + dãy phím chức năng đầy đủ.",
    categoryName: "Phụ kiện",
    image: "/images/magickeyboardm4.png",
    preferredColors: ["Black", "White"],
  },
];

// Hàm sinh biến thể (variants) cho mỗi product
const buildVariantsForProduct = (productName, preferredColors = [], slugBase) => {
  // lấy 3 màu ưu tiên nếu có, nếu không thì lấy 3 màu chung từ commonColors
  const chosenColors = preferredColors.length
    ? // map tên màu ưu tiên sang thông tin color (nếu tìm thấy trong commonColors, giữ hex; nếu không, fallback màu xám)
      preferredColors.map((c) => {
        const found = commonColors.find(
          (cc) => cc.name.toLowerCase() === c.toLowerCase()
        );
        return found || { name: c, hex: "#BFBFBF" };
      })
    : commonColors.slice(0, 3);

  // đảm bảo không quá 4 biến thể
  const variants = chosenColors.slice(0, 4).map((c) => {
    const variantName = c.name.replace(/\s+/g, "-").toLowerCase();
    const image = makePlaceholderImage(slugBase, variantName, 800, 800);
    return {
      name: c.name,
      color: c.hex,
      image,
    };
  });

  return variants;
};

const products = baseProducts.map((p) => {
  const slug = slugify(p.name, { lower: true, strict: true });
  const variants = buildVariantsForProduct(
    p.name,
    p.preferredColors || [],
    slug
  );

  return {
    ...p,
    slug,
    variants,
  };
});

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
        const cslug = slugify(p.categoryName, { lower: true, strict: true });
        category = await Category.create({ name: p.categoryName, slug: cslug });
        console.log(`🆕 Tạo mới Category: ${p.categoryName}`);
      }

      // --- Upsert sản phẩm (cập nhật hoặc tạo mới) ---
      const productDoc = {
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
        category: category._id,
        slug: p.slug,
        variants: p.variants, // <-- lưu variants
        // bạn có thể thêm các trường khác ở đây nếu model hỗ trợ (stock, sku, specs...)
      };

      await Product.updateOne({ slug: p.slug }, { $set: productDoc }, { upsert: true });
      console.log(`✅ Seed/Update thành công: ${p.name} (variants: ${p.variants.length})`);
    }

    console.log("🎉 Hoàn tất seed toàn bộ sản phẩm + variants và ảnh placeholder!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
};

seedProducts();
