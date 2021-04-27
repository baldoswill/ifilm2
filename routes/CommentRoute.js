const express = require('express');
const CommentController = require('../controllers/CommentController');
const UserController = require('../controllers/UserController');

const router = express.Router({ mergeParams: true });

router.use(UserController.protect);
router.route('/').post(CommentController.createComment);

module.exports = router;
































