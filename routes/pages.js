const express      = require('express');
const router       = express.Router();
const Product      = require('../models/Product');
const Blog         = require('../models/Blog');
const Certificate  = require('../models/Certificate');
const Testimonial  = require('../models/Testimonial');
const TeamMember   = require('../models/TeamMember');
const SiteSettings = require('../models/SiteSettings');
const { convertGoogleDriveUrl } = require('../config/helpers');

// Helper: load site settings as flat object
const getSettings = async () => {
  const rows = await SiteSettings.find();
  const s = {};
  rows.forEach(r => { s[r.key] = r.value; });
  return s;
};

// Home
router.get('/', async (req, res) => {
  try {
    const [featured, testimonials, recentBlogs, settings] = await Promise.all([
      Product.find({ isActive: true, featured: true }).sort({ order: 1 }).limit(6),
      Testimonial.find({ isActive: true }).sort({ order: 1 }),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3),
      getSettings(),
    ]);
    res.render('pages/home', { title: 'Cielsko — Premium Indian Spice Exporter',
      metaDescription: "Cielsko is a trusted exporter of premium-quality Indian spices.",
      currentPage: 'home', featuredProducts: featured, testimonials, recentBlogs, settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// About
router.get('/about', async (req, res) => {
  try {
    const [team, settings] = await Promise.all([
      TeamMember.find({ isActive: true }).sort({ order: 1 }),
      getSettings(),
    ]);
    res.render('pages/about', { title: 'About Us — Cielsko',
      metaDescription: "Learn about Cielsko's mission and team.", currentPage: 'about', team, settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Products list
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    const [products, settings] = await Promise.all([
      Product.find(filter).sort({ order: 1, name: 1 }),
      getSettings(),
    ]);
    res.render('pages/products', { title: 'Products — Cielsko',
      metaDescription: "Explore Cielsko's premium Indian spices.", currentPage: 'products',
      products, selectedCategory: category || 'all', settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Single product
router.get('/products/:slug', async (req, res) => {
  try {
    const [product, settings] = await Promise.all([
      Product.findOne({ slug: req.params.slug, isActive: true }),
      getSettings(),
    ]);
    if (!product) return res.status(404).render('pages/404', { title: 'Not Found', currentPage: '' });
    const related = await Product.find({ isActive: true, _id: { $ne: product._id } }).limit(4).sort({ order: 1 });
    res.render('pages/product-detail', { title: `${product.name} — Cielsko`,
      metaDescription: product.metaDescription || product.shortDescription,
      currentPage: 'products', product, related, settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Certificates
router.get('/certificates', async (req, res) => {
  try {
    const [certificates, settings] = await Promise.all([
      Certificate.find({ isActive: true }).sort({ order: 1 }),
      getSettings(),
    ]);
    res.render('pages/certificates', { title: 'Certifications — Cielsko',
      metaDescription: "Cielsko holds FSSAI, MSME, IEC and RCMC certifications.",
      currentPage: 'certificates', certificates, settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Blog list
router.get('/blog', async (req, res) => {
  try {
    const { tag, search } = req.query;
    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
    const [blogs, allBlogs, recentBlogs, settings] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1 }),
      Blog.find({ isPublished: true }, 'tags'),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(5),
      getSettings(),
    ]);
    const allTags = [...new Set(allBlogs.flatMap(b => b.tags))];
    res.render('pages/blog', { title: 'Blog — Cielsko', metaDescription: "Cielsko spice insights.",
      currentPage: 'blog', blogs, allTags, recentBlogs, selectedTag: tag || '', search: search || '', settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Blog post
router.get('/blog/:slug', async (req, res) => {
  try {
    const [blog, recentBlogs, allBlogs, settings] = await Promise.all([
      Blog.findOne({ slug: req.params.slug, isPublished: true }),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(5),
      Blog.find({ isPublished: true }, 'tags'),
      getSettings(),
    ]);
    if (!blog) return res.status(404).render('pages/404', { title: 'Not Found', currentPage: '' });
    const allTags = [...new Set(allBlogs.flatMap(b => b.tags))];
    res.render('pages/blog-detail', { title: `${blog.title} — Cielsko`,
      metaDescription: blog.metaDescription || blog.excerpt,
      currentPage: 'blog', blog, recentBlogs, allTags, settings });
  } catch (err) {
    res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' });
  }
});

// Contact
router.get('/contact', async (req, res) => {
  const settings = await getSettings();
  res.render('pages/contact', { title: 'Contact Us — Cielsko',
    metaDescription: "Get in touch with Cielsko for premium Indian spice exports.",
    currentPage: 'contact', settings });
});

// Static legal pages
const staticPage = (view, title) => async (req, res) => {
  const settings = await getSettings();
  res.render(`pages/${view}`, { title: `${title} — Cielsko`, currentPage: '', settings });
};
router.get('/privacy-policy',    staticPage('privacy',    'Privacy Policy'));
router.get('/terms-conditions',  staticPage('terms',      'Terms & Conditions'));
router.get('/disclaimer',        staticPage('disclaimer', 'Disclaimer'));
router.get('/cookie-policy',     staticPage('cookie',     'Cookie Policy'));

module.exports = router;
