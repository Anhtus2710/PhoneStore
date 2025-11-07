import React from 'react';
import OrderDetail from '../features/my-orders/OrderDetail'; 
import { useParams, Link } from 'react-router-dom';

// Trang Xem Chi Tiết Đơn Hàng
export default function OrderDetailPage() { 
  return (
      <OrderDetail /> 
  );
}