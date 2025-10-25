import React from 'react';
import MainLayout from '../layouts/MainLayout';
import LoginFeature from '../features/auth/Login';

export default function LoginPage() {
  return (
    <MainLayout>
      <LoginFeature />
    </MainLayout>
  );
}