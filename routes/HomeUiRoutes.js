const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const UserController = require('../controllers/UserController');

router.use(UserController.isLoggedIn);

// User Route
router.route('/signup').get(UserController.getSignUp);
router.route('/login').get(UserController.getLogin);
router.route('/verifyAccount/:verifyToken').get(UserController.verifyAccount);
router.route('/forgot-password/').get(UserController.getForgotPassword);
router.route('/reset-password/:passwordToken').get(UserController.getResetPassword);
router.route('/account/edit-account').get(UserController.getMyUpdateAccount);
router.route('/logout').get(UserController.logoutPage);

// Movie Route
router.route('/').get(MovieController.getAllMoviesByAllUser);

module.exports = router;
































