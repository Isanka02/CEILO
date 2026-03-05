import mongoose from 'mongoose';

const shopReviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
}, { timestamps: true });

// One review per user
shopReviewSchema.index({ user: 1 }, { unique: true });

export default mongoose.model('ShopReview', shopReviewSchema);