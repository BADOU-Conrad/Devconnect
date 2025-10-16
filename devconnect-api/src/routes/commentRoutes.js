const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.use(authMiddleware);

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Le contenu est requis'),
  body('task_id').isInt().withMessage('ID de tâche invalide')
];

router.post('/', commentValidation, commentController.createComment);
router.get('/task/:taskId', commentController.getTaskComments);
router.delete('/:id', commentController.deleteComment);

module.exports = router;