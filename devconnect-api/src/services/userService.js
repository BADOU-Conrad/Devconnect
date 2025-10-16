const User = require('../models/User');

const userService = {
  async getAllUsers() {
    return await User.findAll();
  },

  async getUserById(id) {
    return await User.findById(id);
  },

  async getUserByEmail(email) {
    return await User.findByEmail(email);
  },

  async updateUser(id, userData) {
    return await User.update(id, userData);
  },

  async deleteUser(id) {
    return await User.delete(id);
  }
};

module.exports = userService;