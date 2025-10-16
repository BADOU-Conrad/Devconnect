const db = require('../config/database');

class User {
  static create(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password } = userData;
      const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      
      db.run(query, [username, email, password], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username, email });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, username, email, created_at FROM users', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static update(id, userData) {
    return new Promise((resolve, reject) => {
      const { username, email } = userData;
      const query = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
      
      db.run(query, [username, email, id], function(err) {
        if (err) reject(err);
        else resolve({ id, username, email });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = User;