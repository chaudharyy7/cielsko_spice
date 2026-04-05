const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true },
  productCode:      { type: String, trim: true },
  hsCode:           { type: String, trim: true },
  shortDescription: { type: String, required: true },
  description:      { type: String, required: true },
  image:            { type: String, default: '/images/placeholder-spice.svg' },
  category:         { type: String, enum: ['whole','ground','blended','leaves','other'], default: 'whole' },
  origin:           { type: String, default: 'India' },
  botanicalName:    { type: String },
  family:           { type: String },
  harvestTime:      { type: String },
  packaging:        [{ type: String }],
  loadingCapacity:  { type: String },
  appearance:       { type: String },
  form:             { type: String },
  aromaFlavor:      { type: String },
  quality:          { type: String },
  moisture:         { type: String },
  acidInsoluble:    { type: String },
  volatileOil:      { type: String },
  totalAsh:         { type: String },
  extraSpecs:       [{ key: String, value: String }],
  // Multi-language names: [{ language: 'Arabic', name: 'فلفل أحمر' }]
  localNames:       [{ language: String, name: String }],
  featured:         { type: Boolean, default: false },
  order:            { type: Number, default: 0 },
  isActive:         { type: Boolean, default: true },
  metaTitle:        { type: String },
  metaDescription:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
