const express  = require('express');
const router   = express.Router();
const User     = require('../../models/User');
const { requireAuth, generateToken } = require('../../middleware/auth');

// GET /admin/login
router.get('/login', (req, res) => {
  if (req.cookies?.adminToken) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login — Cielsko', error: null });
});

// POST /admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.render('admin/login', { title: 'Admin Login', error: 'Please enter username and password.' });

    const user = await User.findOne({ username: username.toLowerCase(), isActive: true });
    if (!user || !(await user.comparePassword(password)))
      return res.render('admin/login', { title: 'Admin Login', error: 'Invalid username or password.' });

    const token = generateToken(user._id);
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.redirect('/admin');
  } catch (err) {
    res.render('admin/login', { title: 'Admin Login', error: 'Something went wrong. Try again.' });
  }
});

// POST /admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
});

// GET /admin/users  — list users
router.get('/users', requireAuth, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.render('admin/users', { title: 'Manage Users — Admin', active: 'users', users });
});

// POST /admin/users — add user (admin only)
router.post('/users', requireAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.redirect('/admin/users?error=Username+and+password+required');

    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists)
      return res.redirect('/admin/users?error=Username+already+exists');

    await User.create({ username, password, createdBy: req.user._id });
    res.redirect('/admin/users?success=User+added+successfully');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

// POST /admin/users/:id/delete
router.post('/users/:id/delete', requireAuth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.redirect('/admin/users?error=You+cannot+delete+yourself');
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.redirect('/admin/users?success=User+removed');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

// POST /admin/users/:id/reset-password
router.post('/users/:id/reset-password', requireAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4)
      return res.redirect('/admin/users?error=Password+too+short');
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect('/admin/users?error=User+not+found');
    user.password = newPassword;
    await user.save();
    res.redirect('/admin/users?success=Password+updated');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
