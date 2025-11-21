// src/controllers/adminController.js
import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/User.js";

// ==============================================
//  DASHBOARD (Thống kê)
// ==============================================

// 📊 Lấy thống kê admin (ĐÃ SỬA LỖI LOGIC)
export const getAdminStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Lấy doanh thu (Sửa: dùng status: "paid" và $total)
    const revenueStats = await Order.aggregate([
      {
        $match: {
          status: "paid", // Sửa 1: Dùng status: "paid"
          createdAt: { $gte: startOfLastMonth } 
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          total: { $sum: "$total" }     // Sửa 2: Dùng $total
        }
      }
    ]);

    const thisMonthRevenue = revenueStats.find(r => r._id === (now.getMonth() + 1))?.total || 0;
    const lastMonthRevenue = revenueStats.find(r => r._id === (now.getMonth()))?.total || 0;

    let revenuePercentageChange = 0;
    if (lastMonthRevenue > 0) {
      revenuePercentageChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (thisMonthRevenue > 0) {
      revenuePercentageChange = 100;
    }

    const totalRevenueAgg = await Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    // 2. Lấy các số đếm khác
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const users = await User.countDocuments();

    res.json({
      totalRevenue,
      thisMonthRevenue,
      revenuePercentageChange,
      orders,
      products,
      users
    });
  } catch (err) {
    next(err);
  }
};

// 📈 Lấy dữ liệu biểu đồ
export const getRevenueChartData = async (req, res, next) => {
  try {
    const daysToFetch = 14; 
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - (daysToFetch - 1));
    startDate.setHours(0, 0, 0, 0);

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: startDate } 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } } 
    ]);

    const dataMap = new Map(revenueData.map(item => [item._id, item.revenue]));
    const chartData = [];
    for (let i = 0; i < daysToFetch; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      chartData.push({
        date: dateKey,
        revenue: dataMap.get(dateKey) || 0
      });
    }

    res.json(chartData);
  } catch (err) {
    next(err);
  }
};


// ==============================================
//  QUẢN LÝ NGƯỜI DÙNG (Giữ nguyên)
// ==============================================

// 👤 Lấy tất cả người dùng
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// 👤 Cập nhật quyền (role) của người dùng
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || (role !== "admin" && role !== "user")) {
      return res.status(400).json({ message: "Quyền không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật quyền thành công", user });
  } catch (err) {
    next(err);
  }
};

// 👤 Xóa người dùng
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(4404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    next(err);
  }
};