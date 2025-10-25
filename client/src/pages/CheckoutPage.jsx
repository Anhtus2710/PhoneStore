import React from 'react';
import MainLayout from '../layouts/MainLayout';
import CheckoutFeature from '../features/checkout/Checkout';

export default function CheckoutPage() {
  return (
    <MainLayout>
      <CheckoutFeature />
    </MainLayout>
  );
}