import Review from '../models/Review.js';
import Product from '../models/Product.js';

// ─── Helper ───────────────────────────────────────────────────────────────────

const resolveProductId = async (productIdOrSlug) => {
  const isObjectId = /^[a-f\d]{24}$/i.test(productIdOrSlug);
  if (isObjectId) return productIdOrSlug;
  const product = await Product.findOne({ slug: productIdOrSlug });
  return product ? product._id : null;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const getReviews = async (req, res) => {
  try {
    const productId = await resolveProductId(req.params.productId);
    if (!productId) return res.status(404).json({ message: 'Product not found' });

    const reviews = await Review.find({ product: productId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const productId = await resolveProductId(req.params.productId);
    if (!productId) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({ product: productId, user: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({ product: productId, user: req.user.id, rating, comment });

    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { averageRating: avg, numReviews: reviews.length });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};