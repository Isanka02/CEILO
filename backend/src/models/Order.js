import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true },
  color:    { type: String },
  size:     { type: String }
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String },
    zip:     { type: String, required: true },
    country: { type: String, required: true }
  },

  // COD is the only payment method — hardcoded, no alternatives
  paymentMethod:  { type: String, default: 'cod', immutable: true },

  // For COD: 'pending' = not yet collected, 'paid' = collected on delivery
  paymentStatus:  {
    type:    String,
    enum:    ['pending', 'paid'],
    default: 'pending'
  },

  orderStatus: {
    type:    String,
    enum:    ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },

  deliveryMethod: { type: String },
  shippingPrice:  { type: Number, default: 0 },
  totalPrice:     { type: Number, required: true },
  trackingNumber: { type: String },
  isRefunded:     { type: Boolean, default: false },

  // Set automatically when admin marks order as delivered
  deliveredAt:    { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);