import Order from '../models/Order.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // Send async email notification
    sendOrderConfirmationEmail(req.user.email, createdOrder);

    res.status(201).json(createdOrder);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics for admin dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSalesObj = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = totalSalesObj.length > 0 ? totalSalesObj[0].totalSales : 0;

    // Monthly sales data for chart
    const monthlySales = await Order.aggregate([
      { $match: { isPaid: true } },
      { 
        $group: { 
          _id: { $month: "$createdAt" }, 
          sales: { $sum: '$totalPrice' } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedMonthlySales = monthlySales.map(m => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        name: monthNames[m._id - 1],
        sales: m.sales
      }
    });

    res.json({ totalOrders, totalSales, monthlySales: formattedMonthlySales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
