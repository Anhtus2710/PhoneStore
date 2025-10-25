import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ProductAdd from '../features/admin/ProductAdd';

export default function AdminAddProductPage() {
  return (
    <AdminLayout>
      <ProductAdd />
    </AdminLayout>
  );
}