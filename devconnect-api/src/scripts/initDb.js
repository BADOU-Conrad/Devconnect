const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, '../../devconnect.db');

// Supprimer l'ancienne base si elle existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Ancienne base de données supprimée');
}

// Créer la connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données SQLite');
});

const initDatabase = async () => {
  const migrationPath = path.join(__dirname, '../database/migrations/001_initial_schema.sql');

  try {
    // Lire et exécuter la migration
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    await new Promise((resolve, reject) => {
      db.exec(migration, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Migration effectuée avec succès');

    // Insérer les utilisateurs avec des mots de passe hachés
    const hashedPassword = await bcryptjs.hash('password123', 10);
    
    const insertUsers = `
      INSERT INTO users (username, email, password) VALUES
      ('admin', 'admin@devconnect.com', ?),
      ('john_doe', 'john@devconnect.com', ?),
      ('jane_smith', 'jane@devconnect.com', ?);
    `;

    await new Promise((resolve, reject) => {
      db.run(insertUsers, [hashedPassword, hashedPassword, hashedPassword], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Utilisateurs créés avec succès');
    console.log('📧 Credentials de test:');
    console.log('   Email: admin@devconnect.com | Password: password123');
    console.log('   Email: john@devconnect.com | Password: password123');
    console.log('   Email: jane@devconnect.com | Password: password123');

    // Insérer les projets
    const insertProjects = `
      INSERT INTO projects (name, description, owner_id) VALUES
      ('Projet DevConnect', 'Plateforme collaborative pour développeurs', 1),
      ('API REST', 'Développement de l API backend', 1);
    `;

    await new Promise((resolve, reject) => {
      db.run(insertProjects, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Projets créés avec succès');

    // Insérer les membres de projet
    const insertMembers = `
      INSERT INTO project_members (project_id, user_id, role) VALUES
      (1, 1, 'admin'),
      (1, 2, 'user'),
      (1, 3, 'user'),
      (2, 1, 'admin'),
      (2, 2, 'admin');
    `;

    await new Promise((resolve, reject) => {
      db.run(insertMembers, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Membres de projet ajoutés avec succès');

    // Insérer les tâches
    const insertTasks = `
      INSERT INTO tasks (title, description, status, priority, project_id, assigned_to) VALUES
      ('Créer le modèle User', 'Implémenter le modèle User avec SQLite', 'done', 'high', 1, 1),
      ('Développer les routes API', 'Créer les routes pour l authentification', 'in_progress', 'high', 1, 2),
      ('Tester les endpoints', 'Écrire les tests unitaires', 'todo', 'medium', 1, 3),
      ('Documentation API', 'Rédiger la documentation Swagger', 'todo', 'low', 2, 1);
    `;

    await new Promise((resolve, reject) => {
      db.run(insertTasks, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Tâches créées avec succès');

    // Insérer les commentaires
    const insertComments = `
      INSERT INTO comments (content, task_id, user_id) VALUES
      ('Modèle User créé avec succès !', 1, 1),
      ('N oubliez pas d ajouter la validation des emails', 1, 2),
      ('En cours de développement', 2, 2),
      ('Besoin d aide pour les tests ?', 3, 1);
    `;

    await new Promise((resolve, reject) => {
      db.run(insertComments, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Commentaires ajoutés avec succès');
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Base de données initialisée avec succès !');
    console.log('='.repeat(50));

    db.close((err) => {
      if (err) {
        console.error('❌ Erreur lors de la fermeture:', err.message);
        process.exit(1);
      }
      console.log('✅ Connexion fermée');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    db.close();
    process.exit(1);
  }
};

initDatabase();