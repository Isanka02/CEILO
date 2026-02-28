const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = all users
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type:    { type: String, enum: ['order', 'promo', 'info'], default: 'info' },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
