import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory, categoryValidation,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/',        getCategories);
router.get('/:slug',   getCategoryBySlug);
router.post('/',       protect, adminOnly, categoryValidation, createCategory);
router.put('/:id',     protect, adminOnly, categoryValidation, updateCategory);
router.delete('/:id',  protect, adminOnly, deleteCategory);

export default router;