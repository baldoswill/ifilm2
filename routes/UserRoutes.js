const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const uploader = require('../middleware/uploader');
const imageValidation = require('../middleware/imageValidation');

router.route('/signup').post(UserController.postSignUp);
router.route('/login').post(UserController.postLogin);
router.route('/sendVerificationEmail').post(UserController.sendVerificationEmail);
router.route('/forgotPassword').post(UserController.postForgotPassword);
router.route('/resetPassword/:passwordToken').patch(UserController.postResetPassword);


module.exports = router;
































