const express = require('express');
const RatingController = require('../controllers/RatingController');
const UserController = require('../controllers/UserController');

const router = express.Router({ mergeParams: true });
 
router.use(UserController.protect);
router.route('/').post(RatingController.createRating);

module.exports = router;
 