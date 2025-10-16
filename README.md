# DevConnect - Plateforme de gestion de projets

Application complète de gestion de projets collaborative avec authentification.

## Structure du projet

```
Devconnect/
├── devconnect-frontend/   # Frontend React + TypeScript
├── devconnect-backend/    # Backend Express (authentification)
└── start.sh              # Script pour lancer le projet complet
```

## Installation rapide

### Option 1 : Lancement automatique (Recommandé)

1. Installer les dépendances du frontend :
```sh
cd devconnect-frontend
npm install
cd ..
```

2. Installer les dépendances du backend :
```sh
cd devconnect-backend
npm install
cd ..
```

3. Lancer le projet complet :
```sh
./start.sh
```

Cette commande lancera automatiquement :
- Le backend sur `http://localhost:3000`
- Le frontend sur `http://localhost:8080`

### Option 2 : Lancement manuel

**Terminal 1 - Backend :**
```sh
cd devconnect-backend
npm start
```

**Terminal 2 - Frontend :**
```sh
cd devconnect-frontend
npm run dev
```

## Accès à l'application

Une fois les serveurs démarrés, ouvrez votre navigateur à l'adresse :
```
http://localhost:8080/
```

## Fonctionnalités

### Authentification
- Inscription avec username, email et mot de passe
- Connexion avec email et mot de passe
- Génération de token JWT
- Backend Express avec API REST

### Gestion des utilisateurs
- Visualisation des utilisateurs groupés par projets
- Modification des rôles des utilisateurs (Admin uniquement)
- Affichage de l'utilisateur actuel

### Gestion des projets
- Tableau de bord des projets
- Vue détaillée de chaque projet
- Modification de la description du projet (Admin)
- Gestion de l'équipe du projet (ajout/suppression de membres avec rôles)

### Board Kanban
- Phases personnalisables avec couleurs
- Drag & drop des tickets entre les phases
- Réorganisation des tickets dans une même phase
- Ajout/suppression de phases

### Gestion des tickets
- Création de tickets avec titre, description, priorité et assignation
- Modal de détails de ticket avec :
  - Modification du titre et de la description
  - Changement de priorité
  - Ajout/suppression de membres sur le ticket
  - Système de commentaires
- Suppression de tickets

## Technologies utilisées

### Frontend
- **Vite** - Build tool rapide
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI réutilisables
- **@dnd-kit** - Drag and drop
- **Lucide React** - Icônes
- **Sonner** - Notifications toast

### Backend
- **Express** - Framework Node.js
- **bcryptjs** - Hachage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **CORS** - Gestion des requêtes cross-origin

## Note importante

Le backend utilise une base de données en mémoire. Les utilisateurs enregistrés seront perdus au redémarrage du serveur backend.
