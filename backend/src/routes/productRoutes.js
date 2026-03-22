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

router.get('/',      getProducts);
router.get('/:slug', getProductBySlug);

router.post('/',
  protect,
  adminOnly,
  (req, res, next) => {
    uploadProductImages(req, res, (err) => {
      if (err) {
        console.error('❌ Full error:', err);           // ← log entire error object
        console.error('❌ Error name:', err.name);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error http_code:', err.http_code);
        console.error('❌ Error stack:', err.stack);
        return res.status(500).json({ message: err.message || 'Upload failed' });
      }
      console.log('✅ After multer — files:', req.files?.length ?? 0);
      console.log('✅ Body:', req.body);
      next();
    });
  },
  createProductValidation,
  createProduct
);

router.put('/:id',
  protect,
  adminOnly,
  (req, res, next) => {
    uploadProductImages(req, res, (err) => {
      if (err) {
        console.error('❌ Multer/Cloudinary error:', err.message);
        return res.status(500).json({ message: err.message });
      }
      next();
    });
  },
  updateProductValidation,
  updateProduct
);

router.delete('/:id', protect, adminOnly, deleteProduct);

router.get('/:productId/reviews',  getReviews);
router.post('/:productId/reviews', protect, addReview);

export default router;