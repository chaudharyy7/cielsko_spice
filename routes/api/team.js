const express = require('express');
const router = express.Router();
const TeamMember = require('../../models/TeamMember');

router.get('/', async (req, res) => {
  try {
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Team member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Team member removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
