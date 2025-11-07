import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/adminApi"; 


export default function UserManagement() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers(); // Gọi API lấy tất cả user
      const filteredUsers = res.data.filter(user => user.role === 'user'); 
      setUsers(filteredUsers); // Cập nhật state chỉ với user thường
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err); // Ghi log lỗi chi tiết
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUsers();
  }, []); 

  const handleDeleteUser = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng này không?`)) { // Sửa lại thông báo xác nhận
       try {
        await deleteUser(id); // Gọi API xóa
        alert("Xóa người dùng thành công!"); // Thông báo thành công
        loadUsers(); // Tải lại danh sách
      } catch (err) {
         alert("Lỗi khi xóa người dùng: " + (err.response?.data?.message || err.message));
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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
             <tr>
               <td colSpan="3" style={{ textAlign: 'center' }}>Không có người dùng nào.</td>
             </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}