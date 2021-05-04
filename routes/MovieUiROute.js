const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const UserController = require('../controllers/UserController');

router.use(UserController.isLoggedIn);
router.route('/').get(MovieController.getAllMoviesByAllUser);
router.route('/:titleSlug').get(MovieController.getMovieBySlug);
 
 

module.exports = router;
































