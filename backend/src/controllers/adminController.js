import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const updateOrderStatusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'canceled'])
    .withMessage('Invalid order status'),
];

export const sendNotificationValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('type').isIn(['order', 'promo', 'info']).withMessage('Invalid notification type'),
];

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return true;
  }
  return false;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ NEW — Unblock a user
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueAgg, recentOrders, topProducts] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
        Order.aggregate([
          { $unwind: '$items' },
          { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' } } },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ]),
      ]);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue:  revenueAgg[0]?.total || 0,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;
    const { title, message, type, userId } = req.body;
    const notification = await Notification.create({
      title, message, type,
      user: userId || null,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};