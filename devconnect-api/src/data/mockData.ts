export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Developer" | "Designer" | "Product Owner" | "Tester";
  projectId: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  members: string[];
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  comments: Comment[];
}

export interface Phase {
  id: string;
  name: string;
  color: string;
  tickets: Ticket[];
}

// Palette de couleurs disponibles pour les phases
export const PHASE_COLORS = [
  { name: "Bleu", value: "bg-blue-100", border: "border-blue-300", text: "text-blue-900" },
  { name: "Vert", value: "bg-green-100", border: "border-green-300", text: "text-green-900" },
  { name: "Orange", value: "bg-orange-100", border: "border-orange-300", text: "text-orange-900" },
  { name: "Rose", value: "bg-pink-100", border: "border-pink-300", text: "text-pink-900" },
  { name: "Violet", value: "bg-purple-100", border: "border-purple-300", text: "text-purple-900" },
  { name: "Gris", value: "bg-gray-100", border: "border-gray-300", text: "text-gray-900" },
];

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  phases: Phase[];
  memberCount: number;
  progress: number;
}

// Données mockées des projets
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "DevConnect Platform",
    description: "Plateforme de gestion de projets collaborative",
    color: "bg-blue-500",
    memberCount: 8,
    progress: 65,
    phases: [
      {
        id: "p1-1",
        name: "À faire",
        color: "bg-gray-100",
        tickets: [
          {
            id: "t1",
            title: "Ajouter l'authentification OAuth",
            description: "Intégrer Google et GitHub OAuth",
            assignee: "Alice Martin",
            members: ["Alice Martin", "Marc Dupont"],
            priority: "High",
            createdAt: "2024-01-15",
            comments: [
              {
                id: "c1",
                author: "Alice Martin",
                content: "Je vais commencer par Google OAuth",
                createdAt: "2024-01-16T10:30:00",
              },
            ],
          },
          {
            id: "t2",
            title: "Améliorer le design de la sidebar",
            description: "Rendre la sidebar responsive",
            assignee: "Sophie Bernard",
            members: ["Sophie Bernard"],
            priority: "Medium",
            createdAt: "2024-01-16",
            comments: [],
          },
        ],
      },
      {
        id: "p1-2",
        name: "En cours",
        color: "bg-blue-100",
        tickets: [
          {
            id: "t3",
            title: "Implémenter le système de notifications",
            description: "Notifications en temps réel pour les mises à jour",
            assignee: "Marc Dupont",
            members: ["Marc Dupont", "Jean Laurent"],
            priority: "High",
            createdAt: "2024-01-10",
            comments: [],
          },
        ],
      },
      {
        id: "p1-3",
        name: "En test",
        color: "bg-orange-100",
        tickets: [
          {
            id: "t4",
            title: "Tableau de bord utilisateur",
            description: "Afficher les statistiques de l'utilisateur",
            assignee: "Jean Laurent",
            members: ["Jean Laurent"],
            priority: "Medium",
            createdAt: "2024-01-08",
            comments: [],
          },
        ],
      },
      {
        id: "p1-4",
        name: "Terminé",
        color: "bg-green-100",
        tickets: [
          {
            id: "t5",
            title: "Mise en place du routing",
            description: "Configuration de React Router",
            assignee: "Alice Martin",
            members: ["Alice Martin"],
            priority: "High",
            createdAt: "2024-01-05",
            comments: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "E-Commerce Mobile App",
    description: "Application mobile pour le commerce électronique",
    color: "bg-green-500",
    memberCount: 6,
    progress: 45,
    phases: [
      {
        id: "p2-1",
        name: "Backlog",
        color: "bg-gray-100",
        tickets: [
          {
            id: "t6",
            title: "Intégration du paiement Stripe",
            description: "Configurer Stripe pour les paiements",
            assignee: "Pierre Moreau",
            members: ["Pierre Moreau"],
            priority: "High",
            createdAt: "2024-01-12",
            comments: [],
          },
        ],
      },
      {
        id: "p2-2",
        name: "En développement",
        color: "bg-blue-100",
        tickets: [
          {
            id: "t7",
            title: "Page de catalogue produits",
            description: "Afficher tous les produits avec filtres",
            assignee: "Sophie Bernard",
            members: ["Sophie Bernard"],
            priority: "High",
            createdAt: "2024-01-14",
            comments: [],
          },
        ],
      },
      {
        id: "p2-3",
        name: "Terminé",
        color: "bg-green-100",
        tickets: [],
      },
    ],
  },
  {
    id: "3",
    name: "CRM Dashboard",
    description: "Système de gestion de la relation client",
    color: "bg-purple-500",
    memberCount: 5,
    progress: 80,
    phases: [
      {
        id: "p3-1",
        name: "À faire",
        color: "bg-gray-100",
        tickets: [
          {
            id: "t8",
            title: "Export des données en CSV",
            description: "Permettre l'export de toutes les données",
            assignee: "Marie Lefevre",
            members: ["Marie Lefevre"],
            priority: "Low",
            createdAt: "2024-01-17",
            comments: [],
          },
        ],
      },
      {
        id: "p3-2",
        name: "En cours",
        color: "bg-blue-100",
        tickets: [],
      },
      {
        id: "p3-3",
        name: "Terminé",
        color: "bg-green-100",
        tickets: [
          {
            id: "t9",
            title: "Tableau de bord analytique",
            description: "Graphiques et statistiques en temps réel",
            assignee: "Jean Laurent",
            members: ["Jean Laurent", "Luc Michel"],
            priority: "High",
            createdAt: "2024-01-02",
            comments: [],
          },
        ],
      },
    ],
  },
];

// Données mockées des utilisateurs
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice.martin@example.com",
    role: "Admin",
    projectId: "1",
  },
  {
    id: "2",
    name: "Marc Dupont",
    email: "marc.dupont@example.com",
    role: "Developer",
    projectId: "1",
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@example.com",
    role: "Designer",
    projectId: "1",
  },
  {
    id: "4",
    name: "Jean Laurent",
    email: "jean.laurent@example.com",
    role: "Developer",
    projectId: "1",
  },
  {
    id: "5",
    name: "Pierre Moreau",
    email: "pierre.moreau@example.com",
    role: "Product Owner",
    projectId: "2",
  },
  {
    id: "6",
    name: "Marie Lefevre",
    email: "marie.lefevre@example.com",
    role: "Developer",
    projectId: "2",
  },
  {
    id: "7",
    name: "Thomas Petit",
    email: "thomas.petit@example.com",
    role: "Designer",
    projectId: "2",
  },
  {
    id: "8",
    name: "Julie Simon",
    email: "julie.simon@example.com",
    role: "Tester",
    projectId: "3",
  },
  {
    id: "9",
    name: "Luc Michel",
    email: "luc.michel@example.com",
    role: "Developer",
    projectId: "3",
  },
  {
    id: "10",
    name: "Emma Roux",
    email: "emma.roux@example.com",
    role: "Product Owner",
    projectId: "3",
  },
];

// Fonction utilitaire pour obtenir les utilisateurs par projet
export const getUsersByProject = (projectId: string): User[] => {
  return mockUsers.filter((user) => user.projectId === projectId);
};

// Fonction utilitaire pour obtenir un projet par ID
export const getProjectById = (projectId: string): Project | undefined => {
  return mockProjects.find((project) => project.id === projectId);
};

// Utilisateur courant mocké (Admin du projet 1)
export const currentUser: User = {
  id: "1",
  name: "Alice Martin",
  email: "alice.martin@example.com",
  role: "Admin",
  projectId: "1",
};

// Liste de tous les utilisateurs disponibles (incluant ceux non assignés)
export const allAvailableUsers: User[] = [
  ...mockUsers,
  {
    id: "11",
    name: "Claire Dubois",
    email: "claire.dubois@example.com",
    role: "Developer",
    projectId: "", // Non assigné
  },
  {
    id: "12",
    name: "Nicolas Blanc",
    email: "nicolas.blanc@example.com",
    role: "Designer",
    projectId: "", // Non assigné
  },
  {
    id: "13",
    name: "Sarah Cohen",
    email: "sarah.cohen@example.com",
    role: "Tester",
    projectId: "", // Non assigné
  },
  {
    id: "14",
    name: "David Lambert",
    email: "david.lambert@example.com",
    role: "Developer",
    projectId: "", // Non assigné
  },
];
