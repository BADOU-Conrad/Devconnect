const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
  async hashPassword(password) {
    return await bcryptjs.hash(password, 10);
  },

  async comparePassword(password, hashedPassword) {
    return await bcryptjs.compare(password, hashedPassword);
  },

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};

module.exports = authService;