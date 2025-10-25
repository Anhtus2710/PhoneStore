import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price image");
    return res.json(cart || { items: [] });
  } catch (err) { next(err); }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, qty = 1, variant = "" } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => String(i.product) === String(productId) && (i.variant || "") === variant);
    if (idx > -1) {
      cart.items[idx].qty += Math.max(1, parseInt(qty, 10));
    } else {
      cart.items.push({
        product: product._id,
        variant,
        name: product.name,
        image: product.image || "",
        price: product.price || (product.variants?.[0]?.price) || 0,
        qty: Math.max(1, parseInt(qty, 10)),
      });
    }
    await cart.save();
    const populated = await cart.populate("items.product", "name price image");
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

export const updateItem = async (req, res, next) => {
  try {
    const { id, qty } = req.body; // id = cart item _id
    if (!id) return res.status(400).json({ message: "item id required" });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (qty <= 0) item.remove();
    else item.qty = Math.max(1, Math.floor(qty));
    await cart.save();
    const populated = await cart.populate("items.product", "name price image");
    res.json(populated);
  } catch (err) { next(err); }
};

export const removeItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.id(itemId)?.remove();
    await cart.save();
    const populated = await cart.populate("items.product", "name price image");
    res.json(populated);
  } catch (err) { next(err); }
};

export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { upsert: true });
    res.json({ message: "Đã xóa giỏ hàng" });
  } catch (err) { next(err); }
};

// Optional: bulk sync local -> server (accepts items array)
export const syncCart = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    // simple merge: replace server items with provided items
    cart.items = [];
    for (const it of items) {
      const product = await Product.findById(it.productId || it._id);
      if (!product) continue;
      cart.items.push({
        product: product._id,
        variant: it.variant || "",
        name: product.name,
        image: product.image || "",
        price: it.price || product.price || 0,
        qty: Math.max(1, parseInt(it.qty || it.quantity || 1, 10)),
      });
    }
    await cart.save();
    const populated = await cart.populate("items.product", "name price image");
    res.json(populated);
  } catch (err) { next(err); }
};