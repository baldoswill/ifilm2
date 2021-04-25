const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const uploader = require('../middleware/uploader');
const imageValidation = require('../middleware/imageValidation');
const UserController = require('../controllers/UserController');

router.use(UserController.protect, UserController.restrictTo('admin'));
router.route('/').post(uploader.single('picture'), imageValidation, MovieController.createMovie);


module.exports = router;
































