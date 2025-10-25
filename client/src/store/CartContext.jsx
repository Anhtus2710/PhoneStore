import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Lấy giỏ hàng từ localStorage khi khởi động
    try {
      const localCart = localStorage.getItem("cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (e) {
      return [];
    }
  });

  // Tự động lưu vào localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => item._id === product._id);
      if (exist) {
        // Tăng số lượng
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Thêm mới
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        // Xóa nếu số lượng <= 0
        return prevItems.filter((item) => item._id !== productId);
      }
      return prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Tính toán tổng số lượng và tổng tiền
  const { cartCount, totalPrice } = useMemo(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { cartCount: count, totalPrice: price };
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  return useContext(CartContext);
};