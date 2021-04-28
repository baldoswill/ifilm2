const Rating = require('../models/Rating');
const catchAsync = require('../utils/catchAsync');


exports.createRating = catchAsync(async(req, resp,next) => {
    const {rate}=req.body;
    const movieId = req.params.movieId
    const userId = req.user.id;

    const rateDb = await Rating.create({rate, movie: movieId, user: userId});

    return resp.status(201).json({
        status: 'success',
        data:rateDb
    });
});
