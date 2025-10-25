import api from "./axios";

export const getProducts = (category = "") => {
  return api.get(`/products?category=${category}`);
};

export const getProductBySlug = (slug) => {
  return api.get(`/products/slug/${slug}`);
};