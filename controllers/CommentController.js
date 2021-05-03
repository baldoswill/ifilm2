const moment = require('moment');
const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.createComment = catchAsync(async (req, resp, next) => {

    if (!req.body.commentBody || req.body.commentBody === '') {
        
        return next(new AppError('Comment Body is required', 400));
    }

    if (req.body.commentBody.length < 5 || req.body.commentBody.length > 1000) {
        return next(new AppError('Comment Body should not be lesser than 5 and greater than 1000 characters', 400));
    }

    const { commentBody } = req.body;
    const movieId = req.params.movieId
    const userId = req.user.id;

    const commentResult = await Comment.findOne({ movie: movieId, user: userId});
    

    let commentDb;

    if(!commentResult){
        commentDb = await Comment.create({ commentBody, movie: movieId, user: userId });
    }else{
        
        if(commentResult.commentBody && typeof(commentResult.commentBody) !== 'undefined' && commentResult.commentBody !== ''){
            return next(new AppError('You already reviewed this movie', 400));
        }

        commentResult.commentBody = commentBody;
        commentDb = await commentResult.save({validateBeforeSave: false});
        
    }

   
    commentDb.createdDate = moment(commentDb.createdDate.toJSON()).format('lll');
 
    return resp.status(201).json({
        status: 'success',
        data: commentDb
    });
});


exports.getComments = catchAsync(async (req, resp, next) => {

    const movieId = req.params.movieId;
    const comments = await Comment.find({ movie: movieId });

    return resp.status(200).json({
        status: 'success',
        data: comments
    });
});

exports.getCommentByUserIdAndMovieId = catchAsync(async (req, resp, next) => {

    const movieId = req.params.movieId;
    const userId = req.params.userId;
    
    const comment = await Comment.findOne({ movie: movieId, user:userId });

    return resp.status(200).json({
        status: 'success',
        data: comment
    });
});


exports.createRating = catchAsync(async (req, resp, next) => {

    if(!req.user){
        return next(new AppError('You must be login to do this action', 401));
    }

    const { rating } = req.body;
    const movieId = req.params.movieId
    const userId = req.user.id;

    const commentResult = await Comment.findOne({ movie: movieId, user: userId });
    

    let rate;
    
    if (commentResult) {
        rate = await Comment.findOneAndUpdate({ movie: movieId, user: userId }, { rating }, { new: true, validateBeforeSave: false });
    } else {
        rate = await Comment.create({ movie: movieId, user: userId, rating });
    }

    return resp.status(200).json({
        status: 'success',
        data: rate
    });
});


