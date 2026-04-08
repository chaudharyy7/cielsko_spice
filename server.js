require('dotenv').config();
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const connectDB    = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Public APIs
app.use('/api/products',     require('./routes/api/products'));
app.use('/api/blogs',        require('./routes/api/blogs'));
app.use('/api/certificates', require('./routes/api/certificates'));
app.use('/api/testimonials', require('./routes/api/testimonials'));
app.use('/api/team',         require('./routes/api/team'));
app.use('/api/contact',      require('./routes/api/contact'));
app.use('/api/orders',       require('./routes/api/orders'));

// Admin
app.use('/admin', require('./routes/admin/auth'));
app.use('/admin', require('./routes/admin/dashboard'));

// Public pages
app.use('/', require('./routes/pages'));

app.use((req, res) => res.status(404).render('pages/404', { title: 'Not Found', currentPage: '' }));
app.use((err, req, res, next) => res.status(500).render('pages/error', { title: 'Error', message: err.message, currentPage: '' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌶️  Cielsko → http://localhost:${PORT}`);
  console.log(`🔐 Admin   → http://localhost:${PORT}/admin`);
});
