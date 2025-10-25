import React from 'react';
import MainLayout from '../layouts/MainLayout';
import RegisterForm from '../features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <MainLayout>
      <RegisterForm />
    </MainLayout>
  );
}