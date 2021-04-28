const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');


exports.createComment = catchAsync(async(req, resp,next) => {
    const {commentBody}=req.body;
    const movieId = req.params.movieId
    const userId = req.user.id;

    const commentDb = await Comment.create({commentBody, movie: movieId, user: userId});

    return resp.status(201).json({
        status: 'success',
        data:commentDb
    });
});


exports.getComments = catchAsync(async(req, resp,next) => {

    const movieId = req.params.movieId;
    const comments = await Comment.find({movie: movieId});

    return resp.status(201).json({
        status: 'success',
        data:comments
    });
});
 
 