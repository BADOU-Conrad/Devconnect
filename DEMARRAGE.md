# 🚀 Guide de démarrage DevConnect

## ✅ Ce qui a été configuré

1. **Backend d'authentification** créé dans `devconnect-backend/`
   - Serveur Express sur le port 3000
   - API d'inscription et de connexion
   - Hashage des mots de passe avec bcrypt
   - Génération de tokens JWT

2. **Frontend React** dans `devconnect-frontend/`
   - Configuration du proxy Vite pour rediriger `/api` vers `http://localhost:3000`
   - Mise à jour des appels API pour utiliser le backend local
   - Toutes les fonctionnalités de gestion de projets

3. **Script de lancement automatique** `start.sh`
   - Lance le backend et le frontend en une seule commande

## 📋 Étapes pour démarrer

### Première installation

1. **Installer le backend** (une seule fois) :
```bash
cd ~/Devconnect/devconnect-backend
npm install
cd ..
```

2. **Installer le frontend** (déjà fait normalement) :
```bash
cd ~/Devconnect/devconnect-frontend
npm install
cd ..
```

### Lancer l'application

**Option 1 : Script automatique (Recommandé)**
```bash
cd ~/Devconnect
./start.sh
```

**Option 2 : Manuel (2 terminaux)**

Terminal 1 - Backend :
```bash
cd ~/Devconnect/devconnect-backend
npm start
```

Terminal 2 - Frontend :
```bash
cd ~/Devconnect/devconnect-frontend
npm run dev
```

## 🌐 Accès à l'application

Une fois démarrée :
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3000

## 🔐 Test de l'authentification

1. Allez sur http://localhost:8080
2. Cliquez sur "S'inscrire"
3. Créez un compte avec :
   - Username : test
   - Email : test@example.com
   - Password : test123
4. Connectez-vous avec ces identifiants

## ⚠️ Notes importantes

- Le backend DOIT être lancé en premier ou en même temps que le frontend
- Les données utilisateurs sont stockées en mémoire (perdues au redémarrage)
- Toutes les autres données (projets, tickets, etc.) sont mockées en frontend
- Utilisez Ctrl+C pour arrêter les serveurs

## 🐛 En cas de problème

**"Erreur de connexion au serveur"**
→ Vérifiez que le backend est bien lancé sur le port 3000

**"Port déjà utilisé"**
→ Arrêtez les processus existants ou changez le port

**Le frontend ne démarre pas**
→ Vérifiez que vous êtes dans le bon dossier et que `npm install` a été fait
