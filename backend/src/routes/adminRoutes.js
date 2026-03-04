import express from 'express';
import { getAllUsers, blockUser, getAllOrders, updateOrderStatus, getAnalytics, sendNotification } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);   // all admin routes are protected

router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getAnalytics);
router.post('/notifications', sendNotification);

export default router;