const express = require('express');
const TaskController = require('../controllers/taskController');

const setTaskRoutes = (app) => {
    const router = express.Router();
    const taskController = new TaskController();

    router.post('/', taskController.createTask.bind(taskController));
    router.get('/:id', taskController.getTask.bind(taskController));
    router.put('/:id', taskController.updateTask.bind(taskController));
    router.delete('/:id', taskController.deleteTask.bind(taskController));

    app.use('/api/tasks', router);
};

module.exports = setTaskRoutes;