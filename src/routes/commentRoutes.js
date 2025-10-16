const express = require('express');
const CommentController = require('../controllers/commentController');

const router = express.Router();
const commentController = new CommentController();

function setCommentRoutes(app) {
    router.post('/', commentController.createComment.bind(commentController));
    router.get('/:id', commentController.getComment.bind(commentController));
    router.put('/:id', commentController.updateComment.bind(commentController));
    router.delete('/:id', commentController.deleteComment.bind(commentController));

    app.use('/api/comments', router);
}

module.exports = setCommentRoutes;