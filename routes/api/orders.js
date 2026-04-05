const express = require('express');
const router  = express.Router();
const Order   = require('../../models/Order');
const Product = require('../../models/Product');
const { sendOrderEmail } = require('../../config/mailer');

// POST /api/orders — submit order from product page
router.post('/', async (req, res) => {
  try {
    const { productId, name, email, phone, company, country, quantity, packaging, message } = req.body;
    if (!productId || !name || !email)
      return res.status(400).json({ success: false, message: 'Product, name, and email are required.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const order = await Order.create({
      productId, productName: product.name,
      name, email, phone, company, country, quantity, packaging, message,
      ipAddress: req.ip,
    });

    // Send email notification (non-blocking)
    sendOrderEmail(order, product).catch(err => console.error('Email error:', err));

    res.status(201).json({ success: true, message: 'Your order enquiry has been submitted! We will contact you shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — admin only (used internally)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('productId', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id — update status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
