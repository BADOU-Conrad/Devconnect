const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = require('./app');
const db = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Vérifier la connexion à la base de données au démarrage
db.get('SELECT 1', (err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connexion à la base de données établie');
});

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Serveur DevConnect démarré`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 URL: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api`);
  console.log('='.repeat(50));
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    db.close((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la DB:', err);
      }
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT reçu. Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    db.close((err) => {
      if (err) {
        console.error('Erreur lors de la fermeture de la DB:', err);
      }
      process.exit(0);
    });
  });
});

module.exports = server;