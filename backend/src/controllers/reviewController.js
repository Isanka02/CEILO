import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existing = await Review.findOne({ product: req.params.productId, user: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({ product: req.params.productId, user: req.user.id, rating, comment });

    const reviews = await Review.find({ product: req.params.productId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, { averageRating: avg, numReviews: reviews.length });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};