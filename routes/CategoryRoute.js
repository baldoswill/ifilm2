const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const UserController = require('../controllers/UserController');

router.use(UserController.protect, UserController.restrictTo('admin'));
router.route('/').post(CategoryController.createCategory);
router.route('/:id').delete(CategoryController.deleteCategory);
router.route('/:id').patch(CategoryController.updateCategory);

module.exports = router;
































