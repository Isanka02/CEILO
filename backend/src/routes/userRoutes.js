import express from 'express';
import { getProfile, updateProfile, addAddress, deleteAddress, getSavedItems, saveItem, removeSavedItem } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.get('/saved', protect, getSavedItems);
router.post('/saved/:productId', protect, saveItem);
router.delete('/saved/:productId', protect, removeSavedItem);

export default router;