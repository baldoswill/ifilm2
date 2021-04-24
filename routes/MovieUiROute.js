const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');

router.route('/add-movie').get(MovieController.getCreateMovie);
router.route('/').get(MovieController.getAllMovies);
router.route('/:titleSlug').get(MovieController.getMovieBySlug);

module.exports = router;
































