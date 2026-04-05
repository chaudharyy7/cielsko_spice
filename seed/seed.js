require('dotenv').config({ path: require('path').join(__dirname,'../.env') });
const mongoose     = require('mongoose');
const Product      = require('../models/Product');
const Blog         = require('../models/Blog');
const Certificate  = require('../models/Certificate');
const Testimonial  = require('../models/Testimonial');
const TeamMember   = require('../models/TeamMember');
const User         = require('../models/User');
const SiteSettings = require('../models/SiteSettings');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cielsko';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Promise.all([
    Product.deleteMany({}), Blog.deleteMany({}), Certificate.deleteMany({}),
    Testimonial.deleteMany({}), TeamMember.deleteMany({}), SiteSettings.deleteMany({}),
  ]);
  console.log('🗑️  Cleared collections');

  // ── DEFAULT ADMIN USER ──
  const existingAdmin = await User.findOne({ username:'admin' });
  if (!existingAdmin) {
    await User.create({ username:'admin', password:'admin', role:'admin' });
    console.log('✅ Admin user created  →  username: admin  |  password: admin');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // ── SITE SETTINGS ──
  const defaultSettings = [
    { key:'about_years',       value:'2+',     group:'about',   label:'Years of Experience' },
    { key:'about_countries',   value:'10+',    group:'about',   label:'Export Countries' },
    { key:'about_clients',     value:'100%',   group:'about',   label:'Satisfied Clients' },
    { key:'about_varieties',   value:'13+',    group:'about',   label:'Spice Varieties' },
    { key:'about_tagline',     value:'Passion for Quality. Commitment to Trust.', group:'about' },
    { key:'contact_phone1',    value:'+91-7053086259',  group:'contact' },
    { key:'contact_phone2',    value:'+91-99108 48474', group:'contact' },
    { key:'contact_email',     value:'info@cielsko.com', group:'contact' },
    { key:'contact_address',   value:'P50, P Block, P Extension, Mohan Garden, New Delhi – 110059, India', group:'contact' },
    { key:'contact_hours',     value:'Monday – Saturday: 9:00 AM – 6:00 PM IST', group:'contact' },
    { key:'contact_instagram', value:'https://instagram.com', group:'contact' },
    { key:'contact_linkedin',  value:'https://linkedin.com',  group:'contact' },
    { key:'site_logo',         value:'',       group:'general', label:'Site Logo URL' },
  ];
  await SiteSettings.insertMany(defaultSettings);
  console.log('✅ Default settings seeded');

  // ── PRODUCTS ──
  const products = [
    {
      name:'Red Chilli', slug:'red-chilli', productCode:'SP-001', hsCode:'9042190',
      shortDescription:'Sourced for optimal heat and color, ideal for adding a fiery kick to your recipes.',
      description:'Our Red Chilli is carefully sourced from Guntur (Andhra Pradesh) and Byadagi (Karnataka). Known for vivid color, intense pungency, and high capsaicin content.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Andhra Pradesh, India',
      botanicalName:'Capsicum annuum', family:'Solanaceae', harvestTime:'January to May',
      packaging:['1 kg','5 kg','10 kg','25 kg','40 kg (PP Bags or Customized)'],
      loadingCapacity:'20 Ft: 6–7 MTS, 40 Ft: 13–14 MTS',
      appearance:'Whole pods, bright red to deep red', form:'Whole', aromaFlavor:'Pungent, hot, spicy',
      quality:'Premium (Varieties: S4, Teja, 334, Byadgi, etc.)',
      moisture:'Max. 12.00%', acidInsoluble:'Max. 1.50%', volatileOil:'Min. 1.0 mL/100g', totalAsh:'Max. 7.00%',
      localNames:[{ language:'Arabic', name:'فلفل أحمر' },{ language:'Hindi', name:'लाल मिर्च' }],
      featured:true, order:1,
    },
    {
      name:'Whole Turmeric', slug:'whole-turmeric', productCode:'SP-002', hsCode:'0910300',
      shortDescription:'Golden spice with a warm earthy flavor and naturally high curcumin content.',
      description:'Sourced from Erode (Tamil Nadu) and Nizamabad (Telangana). Curcumin content 3–5%, rich golden color.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Tamil Nadu & Telangana, India',
      botanicalName:'Curcuma longa', family:'Zingiberaceae', harvestTime:'January to March',
      packaging:['5 kg','25 kg','50 kg','Custom'],
      loadingCapacity:'20 Ft: 8–9 MTS, 40 Ft: 16–18 MTS',
      appearance:'Fingers, bright yellow to golden orange', form:'Whole / Powder',
      aromaFlavor:'Warm, earthy, mildly bitter', quality:'Premium — Erode / Nizamabad variety',
      moisture:'Max. 10.00%', totalAsh:'Max. 8.00%',
      localNames:[{ language:'Arabic', name:'كركم' },{ language:'Hindi', name:'हल्दी' }],
      featured:true, order:2,
    },
    {
      name:'Green Cardamom', slug:'green-cardamom', productCode:'SP-003', hsCode:'0908310',
      shortDescription:'Aromatic and sweet premium cardamom pods — the Queen of Spices.',
      description:'Hand-picked from Kerala and Karnataka plantations. Complex sweet, floral, slightly spicy aroma.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Kerala & Karnataka, India',
      botanicalName:'Elettaria cardamomum', family:'Zingiberaceae', harvestTime:'August to November',
      packaging:['1 kg','5 kg','25 kg','Custom'],
      appearance:'Green, plump oval pods', form:'Whole Pods',
      aromaFlavor:'Sweet, floral, slightly spicy, eucalyptus note',
      quality:'Bold / Extra Bold / Premium Grade', moisture:'Max. 10.00%',
      localNames:[{ language:'Arabic', name:'هيل' },{ language:'Hindi', name:'इलायची' }],
      featured:true, order:3,
    },
    {
      name:'Black Pepper', slug:'black-pepper', productCode:'SP-004', hsCode:'0904110',
      shortDescription:'The King of Spices — bold, pungent, freshly packed from Kerala.',
      description:'Harvested from the Malabar Coast of Kerala. Strong essential oil content, bulk density 500–570 g/L.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Kerala, India',
      botanicalName:'Piper nigrum', family:'Piperaceae', harvestTime:'November to February',
      packaging:['10 kg','25 kg','50 kg','Custom'],
      loadingCapacity:'20 Ft: 10–12 MTS, 40 Ft: 20–22 MTS',
      appearance:'Black, wrinkled round berries', form:'Whole / Crushed / Powder',
      aromaFlavor:'Pungent, bold, spicy', quality:'500 GL / 550 GL / 570 GL',
      moisture:'Max. 12.00%', volatileOil:'Min. 2.0 mL/100g',
      localNames:[{ language:'Arabic', name:'فلفل أسود' },{ language:'Hindi', name:'काली मिर्च' }],
      featured:true, order:4,
    },
    {
      name:'Cinnamon', slug:'cinnamon', productCode:'SP-005', hsCode:'0906110',
      shortDescription:'Sweet and aromatic true cinnamon — enhances both sweet and savory dishes.',
      description:'Thin, multi-layered quills with warm sweet slightly citrusy note. Ideal for bakeries, beverages, and curries.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'India',
      botanicalName:'Cinnamomum verum', family:'Lauraceae',
      packaging:['5 kg','25 kg','50 kg','Custom'],
      appearance:'Thin rolled quills, tan to light brown', form:'Whole Quills / Powder',
      aromaFlavor:'Sweet, warm, slightly citrusy', quality:'Premium Grade C4/C5',
      localNames:[{ language:'Arabic', name:'قرفة' },{ language:'Hindi', name:'दालचीनी' }],
      featured:true, order:5,
    },
    {
      name:'Clove', slug:'clove', productCode:'SP-006', hsCode:'0907100',
      shortDescription:'Intense aroma and rich flavor — a burst of taste in every dish.',
      description:'High essential oil content (eugenol 72–90%), deep reddish-brown. Sourced from Tamil Nadu and Kerala.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Tamil Nadu, India',
      botanicalName:'Syzygium aromaticum', family:'Myrtaceae',
      packaging:['5 kg','10 kg','25 kg','Custom'],
      appearance:'Dark brown, nail-shaped whole buds', form:'Whole',
      aromaFlavor:'Intensely aromatic, warm, pungent', quality:'Premium export grade',
      moisture:'Max. 12.00%',
      localNames:[{ language:'Arabic', name:'قرنفل' },{ language:'Hindi', name:'लौंग' }],
      featured:true, order:6,
    },
    {
      name:'Dry Ginger Whole', slug:'dry-ginger', productCode:'SP-007',
      shortDescription:'Nutrient-rich Dry Ginger Whole — ideal for dals, soups, and daily cooking.',
      description:'Sun-dried to preserve potent gingerol content. Sourced from Rajasthan and Kerala.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'Rajasthan & Kerala, India',
      botanicalName:'Zingiber officinale', family:'Zingiberaceae',
      packaging:['10 kg','25 kg','50 kg','Custom'],
      form:'Whole dried fingers', aromaFlavor:'Pungent, warm, slightly sweet',
      localNames:[{ language:'Hindi', name:'सोंठ' }], featured:false, order:7,
    },
    {
      name:'Bay Leaves (Tej Patta)', slug:'bay-leaves', productCode:'SP-008',
      shortDescription:'Naturally dried Bay Leaves adding depth and fragrance to every dish.',
      description:'Sourced from the Himalayan foothills of Uttarakhand. Distinctive clove-like aroma.',
      image:'/images/placeholder-spice.svg', category:'leaves', origin:'Uttarakhand, India',
      botanicalName:'Cinnamomum tamala', family:'Lauraceae',
      packaging:['5 kg','10 kg','25 kg','Custom'],
      localNames:[{ language:'Hindi', name:'तेज पत्ता' }], featured:false, order:8,
    },
    {
      name:'Star Anise', slug:'star-anise', productCode:'SP-009',
      shortDescription:'A fragrant spice with a sweet licorice-like flavor for biryanis and teas.',
      description:'High anethole content. Used in Chinese five-spice, biryanis, masala chai.',
      image:'/images/placeholder-spice.svg', category:'whole', origin:'India',
      botanicalName:'Illicium verum', family:'Schisandraceae',
      packaging:['5 kg','10 kg','25 kg','Custom'],
      form:'Whole star', aromaFlavor:'Sweet, licorice-like, intensely aromatic',
      localNames:[{ language:'Hindi', name:'चक्र फूल' }], featured:false, order:9,
    },
  ];
  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products`);

  // ── CERTIFICATES ──
  const certs = [
    { name:'GST Certificate',      description:'Goods and Services Tax registration.', image:'/images/placeholder-cert.svg', issuer:'Government of India', order:1 },
    { name:'MSME Certificate',      description:'Micro, Small and Medium Enterprises recognition.', image:'/images/placeholder-cert.svg', issuer:'Ministry of MSME', order:2 },
    { name:'IEC Certificate',       description:'Import Export Code for international trade.', image:'/images/placeholder-cert.svg', issuer:'DGFT, Ministry of Commerce', order:3 },
    { name:'FSSAI Licence',         description:'Food Safety and Standards Authority of India license.', image:'/images/placeholder-cert.svg', issuer:'FSSAI', order:4 },
    { name:'FiLLiP Approval Letter',description:'Firm registration approval under MCA.', image:'/images/placeholder-cert.svg', issuer:'Ministry of Corporate Affairs', order:5 },
    { name:'RCMC Certificate',      description:'Registration cum Membership Certificate from APEDA.', image:'/images/placeholder-cert.svg', issuer:'APEDA', order:6 },
  ];
  await Certificate.insertMany(certs);
  console.log(`✅ Seeded ${certs.length} certificates`);

  // ── TEAM ──
  const team = [
    { name:'Rohit Prajapati',    designation:'Founder',                   photo:'/images/placeholder-team.svg', order:1 },
    { name:'Shivani Julaha',     designation:'Chief Executive Officer',   photo:'/images/placeholder-team.svg', order:2 },
    { name:'Rahul Kumar',        designation:'Chief Supply Chain Officer', photo:'/images/placeholder-team.svg', order:3 },
    { name:'Ankit Singh Thakur', designation:'Chief Digital Officer',     photo:'/images/placeholder-team.svg', order:4 },
    { name:'Kajal Prajapati',    designation:'Financial Officer',         photo:'/images/placeholder-team.svg', order:5 },
  ];
  await TeamMember.insertMany(team);
  console.log(`✅ Seeded ${team.length} team members`);

  // ── TESTIMONIALS ──
  const testimonials = [
    { name:'Sharukh Ahmed', designation:'Spice Importer', company:'Emirates Trading LLC', country:'UAE', content:'Working with Cielsko has been fantastic. Their turmeric and chili powder are consistently top quality; the aroma and purity are unmatched.', rating:5, order:1 },
    { name:'Fatima Belkacem', designation:'Procurement Manager', company:'Oran Spices Co.', country:'Algeria', content:'Cielsko provides fully compliant labeling and meets all safety standards. Their product consistency and attentive customer service really stand out.', rating:5, order:2 },
    { name:'Hans Müller', designation:'Product Manager', company:'Bavarian Spice Traders GmbH', country:'Germany', content:'Quality and sustainability are paramount here and Cielsko understands this perfectly. Transparent documentation and reliable deliveries.', rating:5, order:3 },
    { name:'Rahim Uddin', designation:'Managing Director', company:'Dhaka Herbs Ltd.', country:'Bangladesh', content:'Cielsko always delivers fresh coriander, cumin, and chili exactly when needed. Flexible packaging and FSSAI-certified products.', rating:5, order:4 },
  ];
  await Testimonial.insertMany(testimonials);
  console.log(`✅ Seeded ${testimonials.length} testimonials`);

  // ── BLOGS ──
  const blogs = [
    {
      title:'Leading Dry Red Chilli Exporter in India: Supplying Premium Indian Dry Red Chillies',
      slug:'leading-dry-red-chilli-exporter-india',
      excerpt:"India is the world's largest producer of spices, and red chillies are central to that reputation.",
      content:`<h2>India's Dominance in Red Chilli Trade</h2><p>India produces over 40 varieties of red chillies across Andhra Pradesh, Rajasthan, Karnataka and Maharashtra. Our Red Chilli is sourced directly from verified farmers in Guntur and Byadagi with rigorous batch testing.</p><h2>Why Choose Cielsko?</h2><p>Every batch is tested for moisture content, ASTA color value, aflatoxin levels, and pesticide residue before export clearance. We offer bulk packaging from 10 kg to 50 kg for food manufacturers worldwide.</p>`,
      author:'rohit.prajapati', image:'/images/placeholder-blog.svg',
      tags:['dry red chilli','guntur red chilli','indian spice exporter','premium quality dry red chilli'],
      category:'Blog', isPublished:true, publishedAt:new Date('2026-02-23'),
    },
    {
      title:'Everything You Need To Know About Indian Spices Exports in 2026',
      slug:'indian-spices-exports-2026',
      excerpt:"India has always been a centre of global spice trade. Here's what's shaping Indian spice exports in 2026.",
      content:`<h2>India's Position in Global Spice Trade</h2><p>India's spice exports are projected to cross $4.5 billion in 2025–26, reaffirming its position as the world's largest producer, consumer, and exporter of spices.</p><h2>Key Trends in 2026</h2><ul><li>Rising demand for organic spices in Europe and North America</li><li>Private label growth for international food brands</li><li>Middle East remains fastest-growing export destination</li></ul>`,
      author:'rohit.prajapati', image:'/images/placeholder-blog.svg',
      tags:['indian spices','spices exporter','best indian spices','indian spice exporter'],
      category:'Blog', isPublished:true, publishedAt:new Date('2026-02-07'),
    },
  ];
  await Blog.insertMany(blogs);
  console.log(`✅ Seeded ${blogs.length} blog posts`);

  console.log('\n🌶️  Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin Login: http://localhost:3000/admin');
  console.log('  Username   : admin');
  console.log('  Password   : admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

seed().catch(err => { console.error('❌', err); process.exit(1); });
