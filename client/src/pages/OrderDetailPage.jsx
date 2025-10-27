import React from 'react';
import MainLayout from '../layouts/MainLayout'; 
// 1. Import component OrderDetail thật
import OrderDetail from '../features/my-orders/OrderDetail'; 
import { useParams, Link } from 'react-router-dom';

// Trang Xem Chi Tiết Đơn Hàng
export default function OrderDetailPage() { 
  return (
    <MainLayout>
      {/* 2. Sử dụng component OrderDetail thật */}
      <OrderDetail /> 
    </MainLayout>
  );
}