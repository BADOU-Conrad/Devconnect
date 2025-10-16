const db = require('../config/database');
const Task = require('../models/Task');
const ProjectMember = require('../models/ProjectMember');

// Create a new task
const createTask = async (taskData) => {
    const { title, description, projectId, userId } = taskData;
    const newTask = await Task.create({ title, description, projectId, userId });
    return newTask;
};

// Get all tasks for a project
const getTasksByProjectId = async (projectId) => {
    const tasks = await Task.findAll({ where: { projectId } });
    return tasks;
};

// Get a task by ID
const getTaskById = async (taskId) => {
    const task = await Task.findByPk(taskId);
    return task;
};

// Update a task
const updateTask = async (taskId, updatedData) => {
    const task = await Task.findByPk(taskId);
    if (task) {
        await task.update(updatedData);
        return task;
    }
    throw new Error('Task not found');
};

// Delete a task
const deleteTask = async (taskId) => {
    const task = await Task.findByPk(taskId);
    if (task) {
        await task.destroy();
        return true;
    }
    throw new Error('Task not found');
};

// Get tasks for a user in a specific project
const getUserTasksInProject = async (userId, projectId) => {
    const projectMember = await ProjectMember.findOne({ where: { userId, projectId } });
    if (!projectMember) {
        throw new Error('User is not a member of this project');
    }
    const tasks = await Task.findAll({ where: { projectId, userId } });
    return tasks;
};

module.exports = {
    createTask,
    getTasksByProjectId,
    getTaskById,
    updateTask,
    deleteTask,
    getUserTasksInProject,
};

const taskService = {
    async createTask(taskData) {
        return await Task.create(taskData);
    },

    async getProjectTasks(projectId) {
        return await Task.findByProjectId(projectId);
    },

    async getTaskById(id) {
        return await Task.findById(id);
    },

    async updateTask(id, taskData) {
        return await Task.update(id, taskData);
    },

    async deleteTask(id) {
        return await Task.delete(id);
    }
};

module.exports = taskService;