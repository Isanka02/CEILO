import express from 'express';
import {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllOrders,
  updateOrderStatus, updateOrderStatusValidation,
  getAnalytics,
  sendNotification,  sendNotificationValidation,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users',              getAllUsers);
router.put('/users/:id/block',    blockUser);
router.put('/users/:id/unblock',  unblockUser);   // ✅ NEW

router.get('/orders',             getAllOrders);
router.put('/orders/:id/status',  updateOrderStatusValidation, updateOrderStatus);

router.get('/analytics',          getAnalytics);

router.post('/notifications',     sendNotificationValidation, sendNotification);

export default router;