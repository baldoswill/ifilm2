const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
 

router.route('/signup').post(UserController.postSignUp);
router.route('/login').post(UserController.postLogin);
router.route('/sendVerificationEmail').post(UserController.sendVerificationEmail);
router.route('/forgotPassword').post(UserController.postForgotPassword);
router.route('/resetPassword/:passwordToken').patch(UserController.postResetPassword);


router.use(UserController.protect);
router.route('/logout').get(UserController.logout);
router.route('/').get(UserController.getAllUsers);
router.route('/patchUpdateMyAccount/:id').patch(UserController.patchUpdateUser); 
router.route('/patchUpdateMyPassword/:id').patch(UserController.postUpdatePassword);

router.use(UserController.restrictTo('admin'));
router.route('/:id').delete(UserController.deleteUser);
router.route('/').post(UserController.postCreateUser);
router.route('/:id').patch(UserController.patchUpdateUser);
router.route('/passwordChange/:id').patch(UserController.patchUpdatePassword);



module.exports = router;
































