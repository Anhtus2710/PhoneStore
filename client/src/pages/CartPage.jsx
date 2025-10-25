import React from 'react';
import MainLayout from '../layouts/MainLayout';
import CartFeature from '../features/cart/Cart';

export default function CartPage() {
  return (
    <MainLayout>
      <CartFeature />
    </MainLayout>
  );
}