const express      = require('express');
const router       = express.Router();
const { requireAuth } = require('../../middleware/auth');
const { convertGoogleDriveUrl } = require('../../config/helpers');
const {
  uploadProduct,
  uploadCert,
  uploadBlog,
  uploadTeam,
  uploadLogo,
} = require('../../config/cloudinary');

const Product      = require('../../models/Product');
const Blog         = require('../../models/Blog');
const Certificate  = require('../../models/Certificate');
const TeamMember   = require('../../models/TeamMember');
const Contact      = require('../../models/Contact');
const Order        = require('../../models/Order');
const SiteSettings = require('../../models/SiteSettings');

// ── HELPERS ───────────────────────────────────────────────────
const slugify = (str) => str.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const parsePackaging = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return val.split(',').map(s => s.trim()).filter(Boolean);
};

const parseExtraSpecs = (keys, vals) => {
  if (!keys) return [];
  const ks = Array.isArray(keys) ? keys : [keys];
  const vs = Array.isArray(vals) ? vals : [vals];
  return ks.map((k, i) => ({ key: k, value: vs[i] || '' })).filter(s => s.key);
};

const parseLocalNames = (langs, names) => {
  if (!langs) return [];
  const ls = Array.isArray(langs) ? langs : [langs];
  const ns = Array.isArray(names) ? names : [names];
  return ls.map((l, i) => ({ language: l, name: ns[i] || '' })).filter(n => n.language && n.name);
};

const resolveImage = (file, urlField, fallback) => {
  if (file && file.path) return file.path;
  if (urlField && urlField.trim()) return convertGoogleDriveUrl(urlField.trim());
  return fallback;
};

// ── DASHBOARD ─────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const [products, blogs, certs, newContacts, newOrders, recentContacts, recentOrders] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Blog.countDocuments({ isPublished: true }),
      Certificate.countDocuments({ isActive: true }),
      Contact.countDocuments({ status: 'new' }),
      Order.countDocuments({ status: 'new' }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard — Cielsko', active: 'dashboard',
      stats: { products, blogs, certs, newContacts, newOrders },
      recentContacts, recentOrders,
    });
  } catch (err) {
    res.status(500).send('Dashboard error: ' + err.message);
  }
});

// ── PRODUCTS ──────────────────────────────────────────────────
router.get('/products', requireAuth, async (req, res) => {
  const products = await Product.find().sort({ order: 1, name: 1 });
  res.render('admin/products/index', {
    title: 'Products — Admin', active: 'products', products,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.get('/products/new', requireAuth, (req, res) => {
  res.render('admin/products/form', {
    title: 'Add Product — Admin', active: 'products', product: null, isEdit: false,
  });
});

router.post('/products/new', requireAuth, uploadProduct.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const image = resolveImage(req.file, b.imageUrl, '/images/placeholder-spice.svg');
    await Product.create({
      name: b.name, slug: slugify(b.slug || b.name),
      productCode: b.productCode, hsCode: b.hsCode,
      shortDescription: b.shortDescription, description: b.description, image,
      category: b.category, origin: b.origin,
      botanicalName: b.botanicalName, family: b.family,
      harvestTime: b.harvestTime, packaging: parsePackaging(b.packaging),
      loadingCapacity: b.loadingCapacity, appearance: b.appearance,
      form: b.form, aromaFlavor: b.aromaFlavor, quality: b.quality,
      moisture: b.moisture, acidInsoluble: b.acidInsoluble,
      volatileOil: b.volatileOil, totalAsh: b.totalAsh,
      extraSpecs: parseExtraSpecs(b['extraSpecKey[]'] || b.extraSpecKey, b['extraSpecVal[]'] || b.extraSpecVal),
      localNames: parseLocalNames(b['localLang[]'] || b.localLang, b['localName[]'] || b.localName),
      featured: b.featured === 'on', order: parseInt(b.order) || 0,
      metaTitle: b.metaTitle, metaDescription: b.metaDescription,
    });
    res.redirect('/admin/products?success=Product+added+successfully');
  } catch (err) {
    res.render('admin/products/form', {
      title: 'Add Product', active: 'products',
      product: req.body, isEdit: false, error: err.message,
    });
  }
});

router.get('/products/:id/edit', requireAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/admin/products?error=Not+found');
  res.render('admin/products/form', {
    title: 'Edit Product — Admin', active: 'products', product, isEdit: true,
  });
});

router.post('/products/:id/edit', requireAuth, uploadProduct.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/admin/products?error=Not+found');
    const image = resolveImage(req.file, b.imageUrl, product.image);
    await Product.findByIdAndUpdate(req.params.id, {
      name: b.name, slug: slugify(b.slug || b.name),
      productCode: b.productCode, hsCode: b.hsCode,
      shortDescription: b.shortDescription, description: b.description, image,
      category: b.category, origin: b.origin,
      botanicalName: b.botanicalName, family: b.family,
      harvestTime: b.harvestTime, packaging: parsePackaging(b.packaging),
      loadingCapacity: b.loadingCapacity, appearance: b.appearance,
      form: b.form, aromaFlavor: b.aromaFlavor, quality: b.quality,
      moisture: b.moisture, acidInsoluble: b.acidInsoluble,
      volatileOil: b.volatileOil, totalAsh: b.totalAsh,
      extraSpecs: parseExtraSpecs(b['extraSpecKey[]'] || b.extraSpecKey, b['extraSpecVal[]'] || b.extraSpecVal),
      localNames: parseLocalNames(b['localLang[]'] || b.localLang, b['localName[]'] || b.localName),
      featured: b.featured === 'on', order: parseInt(b.order) || 0,
      isActive: b.isActive !== 'false',
      metaTitle: b.metaTitle, metaDescription: b.metaDescription,
    });
    res.redirect('/admin/products?success=Product+updated');
  } catch (err) {
    res.redirect(`/admin/products/${req.params.id}/edit?error=` + encodeURIComponent(err.message));
  }
});

router.post('/products/:id/delete', requireAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin/products?success=Product+deleted');
});

router.post('/products/:id/toggle-featured', requireAuth, async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (p) { p.featured = !p.featured; await p.save(); }
  res.redirect('/admin/products');
});

// ── CERTIFICATES ──────────────────────────────────────────────
router.get('/certificates', requireAuth, async (req, res) => {
  const certs = await Certificate.find().sort({ order: 1 });
  res.render('admin/certificates', {
    title: 'Certificates — Admin', active: 'certificates', certs,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.post('/certificates/add', requireAuth, uploadCert.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const image = resolveImage(req.file, b.imageUrl, '/images/placeholder-cert.svg');
    await Certificate.create({ name: b.name, description: b.description, issuer: b.issuer, image, order: parseInt(b.order) || 0 });
    res.redirect('/admin/certificates?success=Certificate+added');
  } catch (err) {
    res.redirect('/admin/certificates?error=' + encodeURIComponent(err.message));
  }
});

router.post('/certificates/:id/edit', requireAuth, uploadCert.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const cert = await Certificate.findById(req.params.id);
    const image = resolveImage(req.file, b.imageUrl, cert.image);
    await Certificate.findByIdAndUpdate(req.params.id, { name: b.name, description: b.description, issuer: b.issuer, image, order: parseInt(b.order) || 0 });
    res.redirect('/admin/certificates?success=Certificate+updated');
  } catch (err) {
    res.redirect('/admin/certificates?error=' + encodeURIComponent(err.message));
  }
});

router.post('/certificates/:id/delete', requireAuth, async (req, res) => {
  await Certificate.findByIdAndDelete(req.params.id);
  res.redirect('/admin/certificates?success=Certificate+deleted');
});

// ── BLOGS ─────────────────────────────────────────────────────
router.get('/blogs', requireAuth, async (req, res) => {
  const blogs = await Blog.find().sort({ publishedAt: -1 });
  res.render('admin/blogs/index', {
    title: 'Blogs — Admin', active: 'blogs', blogs,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.get('/blogs/new', requireAuth, (req, res) => {
  res.render('admin/blogs/form', { title: 'Add Blog — Admin', active: 'blogs', blog: null, isEdit: false });
});

router.post('/blogs/new', requireAuth, uploadBlog.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const image = resolveImage(req.file, b.imageUrl, '/images/placeholder-blog.svg');
    const tags = b.tags ? b.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    await Blog.create({
      title: b.title, slug: slugify(b.slug || b.title),
      excerpt: b.excerpt, content: b.content,
      author: b.author || 'Cielsko Team', image, tags,
      category: b.category || 'Blog',
      isPublished: b.isPublished === 'on',
      publishedAt: b.publishedAt || new Date(),
      metaTitle: b.metaTitle, metaDescription: b.metaDescription,
    });
    res.redirect('/admin/blogs?success=Blog+post+published');
  } catch (err) {
    res.render('admin/blogs/form', {
      title: 'Add Blog', active: 'blogs', blog: req.body, isEdit: false, error: err.message,
    });
  }
});

router.get('/blogs/:id/edit', requireAuth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.redirect('/admin/blogs?error=Not+found');
  res.render('admin/blogs/form', { title: 'Edit Blog — Admin', active: 'blogs', blog, isEdit: true });
});

router.post('/blogs/:id/edit', requireAuth, uploadBlog.single('imageFile'), async (req, res) => {
  try {
    const b = req.body;
    const blog = await Blog.findById(req.params.id);
    const image = resolveImage(req.file, b.imageUrl, blog.image);
    const tags = b.tags ? b.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    await Blog.findByIdAndUpdate(req.params.id, {
      title: b.title, slug: slugify(b.slug || b.title),
      excerpt: b.excerpt, content: b.content, author: b.author, image, tags,
      category: b.category || 'Blog',
      isPublished: b.isPublished === 'on',
      publishedAt: b.publishedAt || blog.publishedAt,
      metaTitle: b.metaTitle, metaDescription: b.metaDescription,
    });
    res.redirect('/admin/blogs?success=Blog+post+updated');
  } catch (err) {
    res.redirect(`/admin/blogs/${req.params.id}/edit?error=` + encodeURIComponent(err.message));
  }
});

router.post('/blogs/:id/delete', requireAuth, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/admin/blogs?success=Blog+deleted');
});

// ── TEAM ──────────────────────────────────────────────────────
router.get('/team', requireAuth, async (req, res) => {
  const team = await TeamMember.find().sort({ order: 1 });
  res.render('admin/team', {
    title: 'Team — Admin', active: 'team', team,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.post('/team/add', requireAuth, uploadTeam.single('photoFile'), async (req, res) => {
  try {
    const b = req.body;
    const photo = resolveImage(req.file, b.photoUrl, '/images/placeholder-team.svg');
    await TeamMember.create({ name: b.name, designation: b.designation, bio: b.bio, photo, linkedin: b.linkedin, order: parseInt(b.order) || 0 });
    res.redirect('/admin/team?success=Team+member+added');
  } catch (err) {
    res.redirect('/admin/team?error=' + encodeURIComponent(err.message));
  }
});

router.post('/team/:id/edit', requireAuth, uploadTeam.single('photoFile'), async (req, res) => {
  try {
    const b = req.body;
    const m = await TeamMember.findById(req.params.id);
    const photo = resolveImage(req.file, b.photoUrl, m?.photo || '/images/placeholder-team.svg');
    await TeamMember.findByIdAndUpdate(req.params.id, { name: b.name, designation: b.designation, bio: b.bio, photo, linkedin: b.linkedin, order: parseInt(b.order) || 0 });
    res.redirect('/admin/team?success=Team+member+updated');
  } catch (err) {
    res.redirect('/admin/team?error=' + encodeURIComponent(err.message));
  }
});

router.post('/team/:id/delete', requireAuth, async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.redirect('/admin/team?success=Team+member+removed');
});

// ── CONTACTS ──────────────────────────────────────────────────
router.get('/contacts', requireAuth, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.render('admin/contacts', {
    title: 'Contacts — Admin', active: 'contacts', contacts,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.post('/contacts/:id/status', requireAuth, async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/contacts');
});

router.post('/contacts/:id/delete', requireAuth, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect('/admin/contacts?success=Deleted');
});

// ── ORDERS ────────────────────────────────────────────────────
router.get('/orders', requireAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('admin/orders', {
    title: 'Orders — Admin', active: 'orders', orders,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.post('/orders/:id/status', requireAuth, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/orders');
});

router.post('/orders/:id/delete', requireAuth, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.redirect('/admin/orders?success=Order+deleted');
});

// ── SETTINGS ──────────────────────────────────────────────────
router.get('/settings', requireAuth, async (req, res) => {
  const allSettings = await SiteSettings.find();
  const settings = {};
  allSettings.forEach(s => { settings[s.key] = s.value; });
  res.render('admin/settings', {
    title: 'Settings — Admin', active: 'settings', settings,
    flash: { success: req.query.success, error: req.query.error },
  });
});

router.post('/settings', requireAuth, uploadLogo.single('logoFile'), async (req, res) => {
  try {
    const b = req.body;
    let logoValue = '';
    if (req.file && req.file.path) logoValue = req.file.path;
    else if (b.site_logo && b.site_logo.trim()) logoValue = convertGoogleDriveUrl(b.site_logo.trim());

    const fields = [
      { key: 'site_logo',         value: logoValue },
      { key: 'about_years',       value: b.about_years       || '2+' },
      { key: 'about_countries',   value: b.about_countries   || '10+' },
      { key: 'about_clients',     value: b.about_clients     || '100%' },
      { key: 'about_varieties',   value: b.about_varieties   || '13+' },
      { key: 'about_tagline',     value: b.about_tagline     || '' },
      { key: 'contact_phone1',    value: b.contact_phone1    || '' },
      { key: 'contact_phone2',    value: b.contact_phone2    || '' },
      { key: 'contact_email',     value: b.contact_email     || '' },
      { key: 'contact_address',   value: b.contact_address   || '' },
      { key: 'contact_hours',     value: b.contact_hours     || '' },
      { key: 'contact_instagram', value: b.contact_instagram || '' },
      { key: 'contact_linkedin',  value: b.contact_linkedin  || '' },
    ];

    for (const f of fields) {
      await SiteSettings.findOneAndUpdate(
        { key: f.key },
        { $set: { value: f.value } },
        { upsert: true, new: true }
      );
    }
    res.redirect('/admin/settings?success=Settings+saved+successfully');
  } catch (err) {
    res.redirect('/admin/settings?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;