const db = require('../config/database');
const Comment = require('../models/Comment');

const commentService = {
  async createComment(commentData) {
    return await Comment.create(commentData);
  },

  async getTaskComments(taskId) {
    return await Comment.findByTaskId(taskId);
  },

  async deleteComment(id) {
    return await Comment.delete(id);
  }
};

module.exports = commentService;