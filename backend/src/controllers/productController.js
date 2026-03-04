import Product from '../models/Product.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';
import { body, query, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
];

export const updateProductValidation = [
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice').optional().isFloat({ min: 0 }).withMessage('Discount price must be positive'),
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

export const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };
    if (keyword)   query.name     = { $regex: keyword, $options: 'i' };
    if (category)  query.category = category;
    if (minPrice || maxPrice)
      query.price = { $gte: Number(minPrice || 0), $lte: Number(maxPrice || 999999) };

    const sortOption =
      sort === 'price_asc'  ? { price: 1 }           :
      sort === 'price_desc' ? { price: -1 }          :
      sort === 'popular'    ? { averageRating: -1 }  :
                              { createdAt: -1 };

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    // If images were uploaded via multer/cloudinary, attach their URLs
    const uploadedImages = req.files ? req.files.map(f => f.path) : [];
    const bodyImages     = Array.isArray(req.body.images) ? req.body.images : [];

    const product = await Product.create({
      ...req.body,
      images: [...uploadedImages, ...bodyImages],
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Merge newly uploaded images with any existing ones kept by client
    const uploadedImages = req.files ? req.files.map(f => f.path) : [];
    const keptImages     = Array.isArray(req.body.images) ? req.body.images : product.images;

    // Delete Cloudinary images that were removed by the client
    const removedImages = product.images.filter(img => !keptImages.includes(img));
    await Promise.all(removedImages.map(deleteCloudinaryImage));

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: [...keptImages, ...uploadedImages] },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Clean up Cloudinary images
    await Promise.all(product.images.map(deleteCloudinaryImage));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};