const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const UserController = require('../controllers/UserController');

router.use(UserController.protect);

router.route('/').get(MovieController.getAllMovies);
router.route('/movies').get(MovieController.getAllMovies);
  

module.exports = router;
































