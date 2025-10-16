const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// helper pour protéger l'appel de handlers (évite Route.*(undefined) qui crash)
const safeHandler = (fnName) => {
  return (req, res, next) => {
    const fn = taskController && taskController[fnName];
    if (typeof fn !== 'function') {
      const err = new Error(`Handler manquant: controllers/taskController.${fnName}`);
      err.status = 500;
      console.error(err.message);
      return next(err);
    }
    try {
      // supporte handler qui prend (req,res) ou (req,res,next)
      return fn(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
};

// Toutes les routes sont protégées
router.use(authMiddleware);

// Validation pour la création de tâche
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('project_id').isInt().withMessage('ID de projet invalide'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Statut invalide'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priorité invalide')
];

router.post('/', taskValidation, safeHandler('createTask'));
router.get('/project/:projectId', safeHandler('getProjectTasks'));
router.get('/:id', safeHandler('getTaskById'));
router.put('/:id', safeHandler('updateTask'));
router.delete('/:id', safeHandler('deleteTask'));

module.exports = router;