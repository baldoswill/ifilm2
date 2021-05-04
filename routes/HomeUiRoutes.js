const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const UserController = require('../controllers/UserController');


router.route('/').get(MovieController.getAllMoviesByAllUser);

module.exports = router;
































