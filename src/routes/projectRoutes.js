const express = require('express');
const ProjectController = require('../controllers/projectController');

const setProjectRoutes = (app) => {
    const router = express.Router();
    const projectController = new ProjectController();

    router.post('/', projectController.createProject.bind(projectController));
    router.get('/:id', projectController.getProject.bind(projectController));
    router.put('/:id', projectController.updateProject.bind(projectController));
    router.delete('/:id', projectController.deleteProject.bind(projectController));

    app.use('/api/projects', router);
};

module.exports = setProjectRoutes;