// src/controllers/orderController.js
import Order from "../models/Order.js"; // Đảm bảo đường dẫn đúng

/**
 * @desc    Tạo đơn hàng mới
 * @route   POST /api/orders
 * @access  Private (User)
 */
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    // Tạo đơn hàng mới dựa trên Order Model
    const order = new Order({
      user: req.user._id, // Từ middleware 'protect'
      // Đảm bảo cấu trúc products khớp với Model
      products: orderItems.map(item => ({
        product: item.product, // ID sản phẩm
        qty: item.qty         // Số lượng
        // Thêm các trường khác nếu Model cho phép (ví dụ: name, price snapshot)
      })),
      shippingAddress,
      paymentMethod,
      total: totalPrice, // Tên trường là 'total' trong Model
      // Status mặc định là 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
  }
};

/**
 * @desc    Lấy tất cả đơn hàng (cho Admin)
 * @route   GET /api/orders
 * @access  Private (Admin)
 */
export const getOrders = async (req, res) => {
  try {
    // Populate để lấy thông tin user liên quan
    const orders = await Order.find({})
                              .populate("user", "id name email") // Chỉ lấy id, name, email
                              .sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng (Admin):", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

/**
 * @desc    Lấy chi tiết đơn hàng theo ID
 * @route   GET /api/orders/:id
 * @access  Private (User sở hữu hoặc Admin)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
                              .populate("user", "name email") // Lấy tên, email người đặt
                              .populate("products.product", "name image price"); // Lấy thông tin cơ bản sản phẩm

    if (order) {
      // Kiểm tra quyền truy cập: Hoặc là admin, hoặc là người tạo đơn hàng
      if (req.user.role === 'admin' || order.user._id.equals(req.user._id)) {
         res.json(order);
      } else {
         res.status(403).json({ message: "Không có quyền truy cập đơn hàng này" });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    console.error(`❌ Lỗi khi lấy đơn hàng ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
};

/**
 * @desc    Lấy danh sách đơn hàng của người dùng đang đăng nhập
 * @route   GET /api/orders/myorders
 * @access  Private (User)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }) // Tìm theo ID user từ token
                              .sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(orders);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng của tôi:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng của bạn" });
  }
};

/**
 * @desc    Người dùng hủy đơn hàng của chính mình (nếu được phép)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (User sở hữu)
 */
export const cancelMyOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Chỉ chủ đơn hàng mới được hủy
        if (!order.user.equals(req.user._id)) {
            return res.status(403).json({ message: "Không có quyền hủy đơn hàng này" });
        }

        // Logic kiểm tra xem có được hủy không (ví dụ: chỉ hủy khi status là 'pending')
        if (order.status !== 'pending') {
            return res.status(400).json({ message: `Không thể hủy đơn hàng ở trạng thái "${order.status}"` });
        }

        // Cập nhật trạng thái
        order.status = 'cancelled'; // Giả sử Model có trạng thái 'cancelled'
        const updatedOrder = await order.save();

        res.json({ message: "Hủy đơn hàng thành công", order: updatedOrder });

    } catch (error) {
        console.error(`❌ Lỗi khi hủy đơn hàng ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Lỗi server khi hủy đơn hàng" });
    }
};

/**
 * @desc    Admin cập nhật trạng thái đơn hàng (ví dụ: paid, shipped)
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res) => {
    // Chỉ admin mới có quyền này (đã được kiểm tra ở route)
    try {
        const { status } = req.body; // Lấy trạng thái mới từ body request

        // Kiểm tra xem status có hợp lệ không (dựa vào enum trong Model)
        const allowedStatuses = Order.schema.path('status').enumValues;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Trạng thái "${status}" không hợp lệ.` });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        order.status = status;
        // Có thể thêm logic khác ở đây, ví dụ: cập nhật isPaid, isDelivered nếu status là 'paid' hoặc 'shipped'

        const updatedOrder = await order.save();
        res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order: updatedOrder });

    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật trạng thái đơn hàng ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái đơn hàng" });
    }
};

