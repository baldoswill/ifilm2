const express = require('express');
const CommentController = require('../controllers/CommentController');
const UserController = require('../controllers/UserController');

const router = express.Router({ mergeParams: true });

router.route('/').get(CommentController.getComments);

router.use(UserController.protect);
router.route('/').post(CommentController.createComment);
router.route('/rating').patch(CommentController.createRating);

module.exports = router;
































