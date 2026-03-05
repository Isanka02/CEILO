import express from 'express';
import {
  getShopReviews,
  submitShopReview, shopReviewValidation,
  deleteShopReview,
} from '../controllers/shopReviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',    getShopReviews);                                    // public
router.post('/',   protect, shopReviewValidation, submitShopReview);   // auth required
router.delete('/', protect, deleteShopReview);                         // auth required

export default router;