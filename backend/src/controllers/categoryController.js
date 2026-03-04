import Category from '../models/Category.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
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

// GET /api/categories — all categories (with optional parent population)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name slug')
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categories/:slug — single category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name slug');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/categories — create (admin only)
export const createCategory = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const exists = await Category.findOne({ slug: req.body.slug });
    if (exists) return res.status(400).json({ message: 'A category with this slug already exists' });

    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/categories/:id — update (admin only)
export const updateCategory = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    // Check slug uniqueness if slug is being changed
    if (req.body.slug) {
      const conflict = await Category.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (conflict) return res.status(400).json({ message: 'Slug already in use by another category' });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/categories/:id — delete (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};