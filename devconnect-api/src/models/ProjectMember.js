const db = require('../config/database');

class ProjectMember {
  static addMember(memberData) {
    return new Promise((resolve, reject) => {
      const { project_id, user_id, role } = memberData;
      const query = `INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)`;
      
      db.run(query, [project_id, user_id, role || 'user'], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, project_id, user_id, role });
      });
    });
  }

  static findByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT pm.*, u.username, u.email 
        FROM project_members pm
        INNER JOIN users u ON pm.user_id = u.id
        WHERE pm.project_id = ?
      `;
      db.all(query, [projectId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getMemberRole(projectId, userId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row ? row.role : null);
        }
      );
    });
  }

  static updateRole(projectId, userId, role) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?',
        [role, projectId, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ updated: this.changes });
        }
      );
    });
  }

  static removeMember(projectId, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, userId],
        function(err) {
          if (err) reject(err);
          else resolve({ deleted: this.changes });
        }
      );
    });
  }
}

module.exports = ProjectMember;