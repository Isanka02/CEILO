const mongoose = require('mongoose');

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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [orderItemSchema],

  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String },
    zip:     { type: String, required: true },
    country: { type: String, required: true }
  },

  paymentMethod: { type: String, required: true },   // "card", "paypal"
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentResult: {
    transactionId: { type: String },
    paidAt:        { type: Date }
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },

  deliveryMethod: { type: String },
  shippingPrice:  { type: Number, default: 0 },
  totalPrice:     { type: Number, required: true },
  trackingNumber: { type: String },
  isRefunded:     { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);