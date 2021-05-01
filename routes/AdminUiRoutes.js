const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const CategoryController = require('../controllers/CategoryController');
const UserController = require('../controllers/UserController');



router.use(UserController.protect, UserController.restrictTo('admin'));

router.route('/').get(MovieController.getAllMovies);
router.route('/movies').get(MovieController.getAllMovies);


router.route('/categories').get(CategoryController.getCategories);


router.route('/users').get(UserController.getUsers);



 
module.exports = router;
































