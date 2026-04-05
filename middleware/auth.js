const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'cielsko_super_secret_2025';

// Verify JWT from cookie — redirect to login if invalid
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) return res.redirect('/admin/login');

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return res.redirect('/admin/login');

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
  }
};

// Verify JWT from cookie or Authorization header — return 401 if invalid
const requireAuthAPI = async (req, res, next) => {
  try {
    const token =
      req.cookies?.adminToken ||
      (req.headers.authorization?.startsWith('Bearer ') &&
        req.headers.authorization.split(' ')[1]);

    if (!token)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { requireAuth, requireAuthAPI, generateToken };

// const requireAuth = async (req, res, next) => {
//   req.user = { _id: 'test123', username: 'admin', role: 'admin' };
//   res.locals.user = req.user;
//   next();
// };

// const requireAuthAPI = async (req, res, next) => {
//   next();
// };

// const generateToken = (userId) => {
//   return 'test-token-' + userId;
// };

// module.exports = { requireAuth, requireAuthAPI, generateToken };

// Commented out the actual JWT implementation for testing purposes. The current version simulates an authenticated user without verifying tokens. To enable real authentication, uncomment the original code and ensure you have a valid JWT_SECRET set in your environment variables.