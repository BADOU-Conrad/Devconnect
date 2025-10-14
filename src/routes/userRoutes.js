const express = require('express');
const UserController = require('../controllers/userController');

const setUserRoutes = (app) => {
    const router = express.Router();
    const userController = new UserController();

    router.post('/users', userController.createUser);
    router.get('/users/:id', userController.getUser);
    router.put('/users/:id', userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);

    app.use('/api', router);
};

module.exports = setUserRoutes;