import express from 'express';
import {
  getProfile,
  updateProfile,   updateProfileValidation,
  addAddress,      addAddressValidation,
  deleteAddress,
  getSavedItems,
  saveItem,
  removeSavedItem,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../config/cloudinary.js';

const router = express.Router();

router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, uploadAvatar, updateProfileValidation, updateProfile);

router.post('/address',              protect, addAddressValidation, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);

router.get('/saved',                protect, getSavedItems);
router.post('/saved/:productId',    protect, saveItem);
router.delete('/saved/:productId',  protect, removeSavedItem);

export default router;