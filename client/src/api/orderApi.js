import api from "./axios.js";
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getMyOrders = () => api.get("/orders/myorders");
export const getOrderDetails = (id) => api.get(`/orders/${id}`);

export const cancelMyOrder = (orderId) => {
  return api.put(`/orders/${orderId}/cancel`);
};
