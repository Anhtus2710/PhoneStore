import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

// 1. Tạo Context
export const AuthContext = createContext();

// 2. Tạo Provider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();

    // Tự động load user nếu có token
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
    }, [token]);

    // Hàm đăng nhập (dùng cho trang Login)
    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
        setToken(token);

        // Kiểm tra role của user
        if (userData.role === "admin") {
            // Nếu là admin, chuyển đến trang quản trị
            navigate("/admin/home");
        } else {
            // Nếu là user thường, về trang chủ
            navigate("/home");
        }
    };
    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        navigate("/home");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Tạo Hook
export const useAuth = () => {
    return useContext(AuthContext);
};