import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ProductManagement from '../features/admin/ProductManagement';

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  );
}