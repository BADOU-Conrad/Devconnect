// src/types/index.js

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'to-do' | 'in-progress' | 'done';
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: Date;
}