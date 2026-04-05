const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String, default: '' },
  photo: { type: String, default: '/images/placeholder-team.jpg' },
  linkedin: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
