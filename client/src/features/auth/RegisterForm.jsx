import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-[350px] w-full mx-4 p-6 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Đăng ký
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Name Input */}
        <input
          type="text"
          placeholder="Nhập tên của bạn"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full border mt-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          className="w-full border mt-3 mb-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed mt-3"
        >
          {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
        </button>

        {/* Switch to Login */}
        <p className="text-center mt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </div>
  );
}