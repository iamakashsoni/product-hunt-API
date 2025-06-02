const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/verifyToken');

router.post('/:id/comments', verifyToken, commentController.addComment);

router.get('/:id/comments', commentController.getComments);

router.post('/reply/:commentId', verifyToken, commentController.addReply);

module.exports = router;
