import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label:     { type: String },
  street:    { type: String },
  city:      { type: String },
  state:     { type: String },
  zip:       { type: String },
  country:   { type: String },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:     { type: String },
  addresses:  [addressSchema],
  savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isBlocked:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);