const db = require('../config/database');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');

const projectService = {
  async createProject(projectData, ownerId) {
    const project = await Project.create({ ...projectData, owner_id: ownerId });
    await ProjectMember.addMember({
      project_id: project.id,
      user_id: ownerId,
      role: 'admin'
    });
    return project;
  },

  async getUserProjects(userId) {
    return await Project.findByUserId(userId);
  },

  async getProjectById(id) {
    return await Project.findById(id);
  },

  async updateProject(id, projectData) {
    return await Project.update(id, projectData);
  },

  async deleteProject(id) {
    return await Project.delete(id);
  }
};

module.exports = projectService;