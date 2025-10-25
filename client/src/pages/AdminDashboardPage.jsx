import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../features/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}