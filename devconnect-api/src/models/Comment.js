const db = require('../config/database');

class Comment {
  static create(commentData) {
    return new Promise((resolve, reject) => {
      const { content, task_id, user_id } = commentData;
      const query = `INSERT INTO comments (content, task_id, user_id) VALUES (?, ?, ?)`;
      
      db.run(query, [content, task_id, user_id], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, content, task_id, user_id });
      });
    });
  }

  static findByTaskId(taskId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.username 
        FROM comments c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.task_id = ?
        ORDER BY c.created_at DESC
      `;
      db.all(query, [taskId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM comments WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = Comment;