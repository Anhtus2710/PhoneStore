import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import OrderManagement from '../features/admin/OrderManagement';

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrderManagement />
    </AdminLayout>
  );
}