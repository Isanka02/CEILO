import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name:           { type: String, required: true },
  slug:           { type: String, required: true, unique: true },
  image:          { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);