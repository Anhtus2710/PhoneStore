// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext"; // Đảm bảo import đúng

export const useAuth = () => {
  return useContext(AuthContext);
};