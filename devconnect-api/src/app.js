const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS pour le développement
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes principales
app.use('/api', routes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'API DevConnect opérationnelle',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      tasks: '/api/tasks',
      comments: '/api/comments'
    }
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales (envoie une réponse JSON)
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  const status = err.status || 500;
  const body = {
    message: err.message || 'Erreur serveur'
  };
  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }
  res.status(status).json(body);
});

module.exports = app;