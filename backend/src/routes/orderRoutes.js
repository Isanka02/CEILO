import express from 'express';
import {
  createOrder,    createOrderValidation,
  getMyOrders,
  getOrderById,
  cancelOrder,
  markAsPaid,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/',                protect, createOrderValidation, createOrder);
router.get('/my-orders',        protect, getMyOrders);
router.get('/:id',              protect, getOrderById);
router.put('/:id/cancel',       protect, cancelOrder);
router.put('/:id/mark-paid',    protect, adminOnly, markAsPaid);  // admin marks cash collected

export default router;