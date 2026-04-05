const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Cielsko Team' },
  image: { type: String, default: '/images/placeholder-blog.jpg' },
  tags: [{ type: String }],
  category: { type: String, default: 'Blog' },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  metaTitle: { type: String },
  metaDescription: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
