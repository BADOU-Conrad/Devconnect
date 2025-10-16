const db = require('../config/database');

class Project {
  static create(projectData) {
    return new Promise((resolve, reject) => {
      const { name, description, owner_id } = projectData;
      const query = `INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)`;
      
      db.run(query, [name, description, owner_id], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, name, description, owner_id });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM projects', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.* FROM projects p
        INNER JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
      `;
      db.all(query, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static update(id, projectData) {
    return new Promise((resolve, reject) => {
      const { name, description } = projectData;
      const query = `UPDATE projects SET name = ?, description = ? WHERE id = ?`;
      
      db.run(query, [name, description, id], function(err) {
        if (err) reject(err);
        else resolve({ id, name, description });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = Project;