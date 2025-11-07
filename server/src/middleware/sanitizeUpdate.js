// server/src/middlewares/sanitizeUpdate.js
export function sanitizeUpdate(req, _res, next) {
  const isBlank = (v) =>
    v === undefined || v === null || v === "" || v === "undefined" || v === "null";

  const toNumber = (v) => {
    if (isBlank(v)) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const toBool = (v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(s)) return true;
      if (["false", "0", "no", "off"].includes(s)) return false;
    }
    return undefined;
  };

  const b = req.body || {};

  // Chuẩn hóa trực tiếp lên req.body để controller nhận giá trị sạch
  if (isBlank(b.name)) delete b.name;
  if (isBlank(b.description)) delete b.description;
  if (isBlank(b.category)) delete b.category;

  const price = toNumber(b.price);
  if (price === undefined) delete b.price; else b.price = price;

  const offerPrice = toNumber(b.offerPrice);
  if (offerPrice === undefined) delete b.offerPrice; else b.offerPrice = offerPrice;

  const featured = toBool(b.featured);
  if (featured === undefined) delete b.featured; else b.featured = featured;

  const inStock = toBool(b.inStock);
  if (inStock === undefined) delete b.inStock; else b.inStock = inStock;

  next();
}
