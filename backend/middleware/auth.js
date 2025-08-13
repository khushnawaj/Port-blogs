// middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ error: 'Not authorized' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
