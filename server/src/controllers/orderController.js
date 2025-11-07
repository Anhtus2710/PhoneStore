import Order from "../models/Order.js";
import User from "../models/User.js";
/**
 * @desc    Tạo đơn hàng mới
 * @route   POST /api/orders
 * @access  Private (User)
 */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }
    const order = new Order({
      user: req.user._id,
      products: orderItems.map((item) => ({
        product: item.product,
        qty: item.qty,
      })),
      shippingAddress,
      paymentMethod,
      total: totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng (Admin):", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name image price");

    if (order) {
      if (req.user.role === "admin" || order.user._id.equals(req.user._id)) {
        res.json(order);
      } else {
        res
          .status(403)
          .json({ message: "Không có quyền truy cập đơn hàng này" });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy đơn hàng ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng của tôi:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng của bạn" });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (!order.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Không có quyền hủy đơn hàng này" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Không thể hủy đơn hàng ở trạng thái "${order.status}"`,
      });
    }

    order.status = "cancelled";
    const updatedOrder = await order.save();

    res.json({ message: "Hủy đơn hàng thành công", order: updatedOrder });
  } catch (error) {
    console.error(`❌ Lỗi khi hủy đơn hàng ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server khi hủy đơn hàng" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = Order.schema.path("status").enumValues;
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: `Trạng thái "${status}" không hợp lệ.` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "id name email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      `❌ Lỗi khi cập nhật trạng thái đơn hàng ID ${req.params.id}:`,
      error
    );
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Dữ liệu trạng thái không hợp lệ.",
        details: error.errors,
      });
    }
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật trạng thái đơn hàng" });
  }
};

export const searchOrders = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res
        .status(400)
        .json({
          message: "Vui lòng cung cấp từ khóa tìm kiếm (email hoặc SĐT).",
        });
    }
    let userIds = [];
    if (searchTerm.includes("@")) {
      const users = await User.find({
        email: { $regex: searchTerm, $options: "i" },
      });
      userIds = users.map((user) => user._id);
    }
    const searchCriteria = {
      $or: [
        { user: { $in: userIds } },
        { "shippingAddress.phone": { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (userIds.length === 0 && !searchTerm.includes("@")) {
      searchCriteria.$or.shift();
    }
    const orders = await Order.find(searchCriteria)
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi tìm kiếm đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm đơn hàng" });
  }
};
