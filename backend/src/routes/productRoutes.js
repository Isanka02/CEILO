import express from 'express';
import {
  getProducts, getProductBySlug,
  createProduct, createProductValidation,
  updateProduct, updateProductValidation,
  deleteProduct,
} from '../controllers/productController.js';
import { addReview, getReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { uploadProductImages } from '../config/cloudinary.js';

const router = express.Router();

router.get('/',       getProducts);
router.get('/:slug',  getProductBySlug);

router.post('/',
  protect, adminOnly,
  uploadProductImages,          // handles multipart/form-data with images[]
  createProductValidation,
  createProduct
);

router.put('/:id',
  protect, adminOnly,
  uploadProductImages,
  updateProductValidation,
  updateProduct
);

router.delete('/:id', protect, adminOnly, deleteProduct);

router.get('/:productId/reviews',  getReviews);
router.post('/:productId/reviews', protect, addReview);

export default router;