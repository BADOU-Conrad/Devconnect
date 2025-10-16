const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware'); // correction : importer le middleware spécifique
const { checkProjectRole } = require('../middleware/roleMiddleware'); // si besoin
const { body } = require('express-validator');

// Toutes les routes sont protégées
router.use(authMiddleware);

// Validation pour la création de projet
const projectValidation = [
  body('name').trim().notEmpty().withMessage('Le nom du projet est requis'),
  body('description').optional().trim()
];

// Routes de base
router.post('/', projectValidation, projectController.createProject);
router.get('/', projectController.getUserProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectValidation, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Routes pour la gestion des membres
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);
router.put('/:id/members/:userId', projectController.updateMemberRole);

module.exports = router;