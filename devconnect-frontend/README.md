# DevConnect Frontend

Application de gestion de projets collaborative construite avec React, TypeScript et Tailwind CSS.

## Installation et démarrage

### Prérequis

- Node.js (version 16 ou supérieure)
- npm
- Le backend DevConnect doit être lancé (voir ../devconnect-backend)

### Installation

1. Naviguer dans le dossier du projet :
```sh
cd devconnect-api
```

2. Installer les dépendances :
```sh
npm install
```

3. Démarrer le serveur de développement :
```sh
npm run dev
```

4. Ouvrir votre navigateur à l'adresse :
```
http://localhost:8080/
```

**Note:** Le frontend se connecte automatiquement au backend sur `http://localhost:3000` via un proxy Vite.

## Technologies utilisées

Ce projet est construit avec :

- **Vite** - Build tool rapide
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI réutilisables
- **@dnd-kit** - Drag and drop
- **Lucide React** - Icônes
- **Sonner** - Notifications toast

## Fonctionnalités

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

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── ui/             # Composants shadcn/ui
├── data/
│   └── mockData.ts     # Données mockées (frontend uniquement)
├── pages/              # Pages de l'application
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Projects.tsx
│   └── ProjectDetails.tsx
└── App.tsx             # Configuration des routes
```

## Note importante

Cette application utilise :
- **Backend** pour l'authentification (Login/Register)
- **Frontend** avec données mockées pour toutes les autres fonctionnalités (projets, tickets, utilisateurs, etc.)
