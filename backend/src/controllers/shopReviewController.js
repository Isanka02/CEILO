import ShopReview from '../models/ShopReview.js';
import { body, validationResult } from 'express-validator';

// ─── Validation Rules ────────────────────────────────────────────────────────

export const shopReviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be a whole number between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be 500 characters or fewer'),
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

/**
 * GET /api/shop-reviews
 * Public — returns all shop reviews with basic user info,
 * plus an overall average rating.
 */
export const getShopReviews = async (req, res) => {
  try {
    const reviews = await ShopReview.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      total: reviews.length,
      averageRating: Math.round(average * 10) / 10, // e.g. 4.3
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/shop-reviews
 * Authenticated users only. One review per user — updating is allowed.
 */
export const submitShopReview = async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { rating, comment } = req.body;

    // Upsert: create or update this user's shop review
    const review = await ShopReview.findOneAndUpdate(
      { user: req.user.id },
      { rating, comment },
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/shop-reviews
 * Authenticated user deletes their own shop review.
 */
export const deleteShopReview = async (req, res) => {
  try {
    const review = await ShopReview.findOneAndDelete({ user: req.user.id });
    if (!review) return res.status(404).json({ message: 'No review found to delete' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};