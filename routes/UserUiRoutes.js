const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


router.use(UserController.isLoggedIn);
router.route('/signup').get(UserController.getSignUp);
router.route('/login').get(UserController.getLogin);
router.route('/verifyAccount/:verifyToken').get(UserController.verifyAccount);
router.route('/forgot-password/').get(UserController.getForgotPassword);
router.route('/reset-password/:passwordToken').get(UserController.getResetPassword);
router.route('/account/edit-account').get(UserController.getMyUpdateAccount);


module.exports = router;
































