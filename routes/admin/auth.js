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

    const user = await User.findOne({ username: username.toLowerCase().trim(), isActive: true });
    if (!user || !(await user.comparePassword(password)))
      return res.render('admin/login', { title: 'Admin Login', error: 'Invalid username or password.' });

    const token = generateToken(user._id);
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

// GET /admin/users
router.get('/users', requireAuth, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.render('admin/users', {
    title: 'Manage Users — Admin',
    active: 'users',
    users,
    flash: { success: req.query.success, error: req.query.error },
  });
});

// POST /admin/users — add new admin user
router.post('/users', requireAuth, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim())
      return res.redirect('/admin/users?error=Username+is+required');

    if (!password || password.length < 4)
      return res.redirect('/admin/users?error=Password+must+be+at+least+4+characters');

    const exists = await User.findOne({ username: username.toLowerCase().trim() });
    if (exists)
      return res.redirect('/admin/users?error=Username+already+exists');

    const newUser = new User({
      username: username.toLowerCase().trim(),
      password: password,
      role: 'admin',
      createdBy: req.user._id,
      isActive: true,
    });
    await newUser.save();

    res.redirect('/admin/users?success=User+' + encodeURIComponent(username) + '+added+successfully');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

// POST /admin/users/:id/delete — disable user
router.post('/users/:id/delete', requireAuth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.redirect('/admin/users?error=You+cannot+delete+yourself');
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.redirect('/admin/users?success=User+disabled+successfully');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

// POST /admin/users/:id/reset-password — reset another user's password
router.post('/users/:id/reset-password', requireAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4)
      return res.redirect('/admin/users?error=Password+must+be+at+least+4+characters');

    const user = await User.findById(req.params.id);
    if (!user)
      return res.redirect('/admin/users?error=User+not+found');

    user.password = newPassword;
    await user.save();
    res.redirect('/admin/users?success=Password+updated+successfully');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

// POST /admin/users/change-my-credentials — logged in user changes own username/password
router.post('/users/change-my-credentials', requireAuth, async (req, res) => {
  try {
    const { newUsername, currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.redirect('/admin/users?error=User+not+found');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.redirect('/admin/users?error=Current+password+is+incorrect');

    // Update username if provided
    if (newUsername && newUsername.trim() && newUsername.trim() !== user.username) {
      const exists = await User.findOne({ username: newUsername.toLowerCase().trim(), _id: { $ne: user._id } });
      if (exists)
        return res.redirect('/admin/users?error=That+username+is+already+taken');
      user.username = newUsername.toLowerCase().trim();
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 4)
        return res.redirect('/admin/users?error=New+password+must+be+at+least+4+characters');
      if (newPassword !== confirmPassword)
        return res.redirect('/admin/users?error=New+passwords+do+not+match');
      user.password = newPassword;
    }

    await user.save();

    // Re-issue token with updated info and force re-login
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
  } catch (err) {
    res.redirect('/admin/users?error=' + encodeURIComponent(err.message));
  }
});

module.exports = router;
