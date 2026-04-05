const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Product info
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  // Customer info
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String, trim: true },
  company:     { type: String, trim: true },
  country:     { type: String, trim: true },
  quantity:    { type: String, trim: true },
  packaging:   { type: String, trim: true },
  message:     { type: String },
  // Status
  status:      { type: String, enum: ['new','processing','replied','closed'], default: 'new' },
  ipAddress:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
