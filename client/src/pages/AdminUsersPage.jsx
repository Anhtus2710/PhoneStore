import React from 'react';
import AdminLayout from '../layouts/AdminLayout';
import UserManagement from '../features/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  );
}