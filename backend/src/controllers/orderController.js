import Order from '../models/Order.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product')
    .notEmpty().withMessage('Each item must reference a product'),
  body('items.*.name')
    .notEmpty().withMessage('Each item must have a name'),
  body('items.*.price')
    .isFloat({ min: 0 }).withMessage('Each item must have a valid price'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .notEmpty().withMessage('Street is required'),
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.zip')
    .notEmpty().withMessage('Zip is required'),
  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required'),
  body('totalPrice')
    .isFloat({ min: 0 }).withMessage('Total price must be a positive number'),
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

/**
 * POST /api/orders
 * Place a new COD order. paymentMethod is always 'cod'.
 */
export const createOrder = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { items, shippingAddress, deliveryMethod, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod: 'cod',   // always COD — never taken from client input
      deliveryMethod,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/orders/my-orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be canceled' });
    }

    order.orderStatus = 'canceled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/orders/:id/mark-paid   (admin only)
 * Mark a delivered COD order as paid (cash collected).
 */
export const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already marked as paid' });
    }

    order.paymentStatus = 'paid';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};