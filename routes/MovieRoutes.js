const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const uploader = require('../middleware/uploader');
const imageValidation = require('../middleware/imageValidation');
const UserController = require('../controllers/UserController');
const CommentRoute = require('./CommentRoute');
const RatingRoutes = require('./RatingRoutes');

router.use(UserController.protect);

router.use('/:movieId/comments', CommentRoute);
router.use('/:movieId/ratings', RatingRoutes);
router.route('/:id').get(MovieController.getMovieById);


router.use(UserController.restrictTo('admin'));
router.route('/:id').delete(MovieController.deleteMovie);
router.route('/').post(uploader.single('picture'), imageValidation, MovieController.createMovie);
router.route('/:id').patch( MovieController.updateMovie);


module.exports = router;
































