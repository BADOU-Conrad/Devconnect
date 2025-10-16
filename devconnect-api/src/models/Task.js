const db = require('../config/database');

class Task {
  static create(taskData) {
    return new Promise((resolve, reject) => {
      const { title, description, status, priority, project_id, assigned_to } = taskData;
      const query = `INSERT INTO tasks (title, description, status, priority, project_id, assigned_to) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.run(query, [title, description, status || 'todo', priority || 'medium', project_id, assigned_to], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...taskData });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE project_id = ?', [projectId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static update(id, taskData) {
    return new Promise((resolve, reject) => {
      const { title, description, status, priority, assigned_to } = taskData;
      const query = `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, assigned_to = ? 
                     WHERE id = ?`;
      
      db.run(query, [title, description, status, priority, assigned_to, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...taskData });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes });
      });
    });
  }
}

module.exports = Task;