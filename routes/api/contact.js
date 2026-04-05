const express = require('express');
const router = express.Router();
const Contact = require('../../models/Contact');

// POST submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, country, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }
    const contact = new Contact({
      name, email, phone, country, subject, message,
      ipAddress: req.ip,
    });
    await contact.save();
    res.status(201).json({ success: true, message: 'Your message has been received. We will contact you soon!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all contacts (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update contact status
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
