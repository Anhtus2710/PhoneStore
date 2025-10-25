import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../../api/adminApi";
import "./admin.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (window.confirm(`Đổi quyền user ${id} thành "${newRole}"?`)) {
      try {
        await updateUser(id, { role: newRole });
        loadUsers();
      } catch (err) {
         alert("Lỗi khi cập nhật quyền.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ID ${id}?`)) {
       try {
        await deleteUser(id);
        loadUsers();
      } catch (err) {
         alert("Lỗi khi xóa người dùng.");
      }
    }
  };

  if (loading) return <p>⏳ Đang tải danh sách người dùng...</p>;
  if (error) return <p>⚠️ {error}</p>;

  return (
    <>
      <h1>👤 Quản lý người dùng</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditRole(user._id, user.role)}
                >
                  Đổi quyền
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}