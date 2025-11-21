import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { login as loginApi } from '../../api/authApi';

export default function LoginFeature() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginApi({ email, password });
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
          Đăng nhập
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Forgot Password */}
        <div className="text-right py-4">
          <a className="text-blue-600 underline" href="#">
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {/* Switch to Register */}
        <p className="text-center mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}