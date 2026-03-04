import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  color: { type: String },
  size:  { type: String },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true },
  discountPrice: { type: Number },
  images:        [{ type: String }],
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags:          [{ type: String }],
  variants:      [variantSchema],
  averageRating: { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);