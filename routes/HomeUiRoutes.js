const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');

router.route('/').get(MovieController.getAllMovies);

module.exports = router;
































