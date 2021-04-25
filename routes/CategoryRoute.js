const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const UserController = require('../controllers/UserController');

router.use(UserController.protect, UserController.restrictTo('admin'));
router.route('/').post(CategoryController.createCategory);

module.exports = router;
































