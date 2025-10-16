const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données à la racine du projet
const dbPath = path.join(__dirname, '../../devconnect.db');

console.log('📁 Chemin de la base de données:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
  } else {
    console.log('✅ Base de données SQLite connectée');
  }
});

// Activer les clés étrangères
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) {
    console.error('❌ Erreur lors de l\'activation des clés étrangères:', err);
  }
});

module.exports = db;