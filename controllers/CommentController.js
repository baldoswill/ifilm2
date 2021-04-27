const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');


exports.createComment = catchAsync(async(req, resp,next) => {

    const {comment}=req.body;
    const movieId = req.params.movieId
    const userId = req.user.id;
    console.log('[Movie Id]', movieId);
    const commentDb = await Comment.create({comment, movie: movieId, user: userId});

    return resp.status(201).json({
        status: 'success',
        data:commentDb
    });
});
 