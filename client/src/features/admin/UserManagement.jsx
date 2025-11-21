import React, { useEffect, useState } from "react";
import { FaUsers, FaTrash, FaEnvelope, FaUser } from "react-icons/fa";
import { getUsers, deleteUser } from "../../api/adminApi"; 

export default function UserManagement() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      const filteredUsers = res.data.filter(user => user.role === 'user'); 
      setUsers(filteredUsers);
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err);
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []); 

  const handleDeleteUser = async (id, userName) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}" không?`)) {
      try {
        await deleteUser(id);
        alert("Xóa người dùng thành công!");
        loadUsers();
      } catch (err) {
        alert("Lỗi khi xóa người dùng: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">Quản lý danh sách người dùng trong hệ thống</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">⏳ Đang tải danh sách người dùng...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <FaUsers className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có người dùng nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        Tên
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{user.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          <FaTrash />
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {!loading && users.length > 0 && (
          <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Tổng số người dùng: <span className="font-semibold text-gray-900">{users.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}