# DevConnect Backend - API d'authentification

Backend simple pour l'authentification des utilisateurs de DevConnect.

## Installation

1. Naviguer dans le dossier backend :
```sh
cd devconnect-backend
```

2. Installer les dépendances :
```sh
npm install
```

## Démarrage

Démarrer le serveur backend :
```sh
npm start
```

Le serveur démarre sur `http://localhost:3000`

## Endpoints disponibles

### POST /api/auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /api/auth/login
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /api/users
Liste tous les utilisateurs (pour debug)

## Note

Ce backend utilise une base de données en mémoire. Les données sont perdues à chaque redémarrage du serveur.
