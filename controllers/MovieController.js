const Movie = require('../models/Movie');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');
const moment = require('moment');
const AppError = require('../utils/AppError');


exports.createMovie = catchAsync(async (req, resp, next) => {

    if (typeof (req.body) === "undefined") {
        return next(new AppError('All fields are required'));
    }

    req.body.picture = req.file?.filename;
    const movie = await Movie.create(req.body);

    return resp.status(201).json({
        status: 'success',
        data: movie
    });
});

exports.getCreateMovie = catchAsync(async (req, resp, next) => {
    const categories = await Category.find();
    return resp.render('add-movie.html', { categories });
});

exports.getEditMovie = catchAsync(async (req, resp, next) => {

    const categories = await Category.find();
    const movie = await Movie.findById(req.params.id);

    return resp.render('edit-movie.html', { categories, movie });
});

exports.getAllMoviesByAdmin = catchAsync(async (req, resp, next) => {
 

    req.query.limit = 8;
    const currentPage = req.query.page * 1 || 1

    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const totalRows = await Movie.count();
    const numberOfPages = Math.ceil(totalRows / req.query.limit);
    const movies = await features.query;

    return resp.render('movie-list.html', { movies, numberOfPages, currentPage, userLoggedIn: resp.locals?.user });
});


exports.getAllMoviesByAllUser = catchAsync(async (req, resp, next) => {
     
     if(req.query.title){
         let title = req.query.title;
         delete req.query.title

         req.query.title = {
             regex : title
         } 
     }
     
   
 
    req.query.limit = 8;
    const currentPage = req.query.page * 1 || 1

    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const totalRows = await Movie.count();
    const numberOfPages = Math.ceil(totalRows / req.query.limit);
    const movies = await features.query;

    return resp.render('main.html', { movies, numberOfPages, currentPage, userLoggedIn: resp.locals?.user });
});

exports.getMovieBySlug = catchAsync(async (req, resp, next) => {

    const movie = await Movie.findOne({ titleSlug: req.params.titleSlug }).populate('comments').lean();

    movie.comments.forEach(comment => {
        let createdDate = new Date(comment.createdDate);
        let dateAndTime = createdDate.toLocaleString('en-US', {
            month: 'long', // numeric, 2-digit, long, short, narrow
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit                        
            hour: 'numeric', // numeric, 2-digit
            minute: 'numeric', // numeric, 2-digit    
            hour12: true
        });

        comment.createdDate = dateAndTime;
    });

    if (!movie) {
        return resp.render('error.html');
    }

    return resp.render('movie-details.html', { movie, userLoggedIn: resp.locals?.user });
});

exports.getMovieById = catchAsync(async (req, resp, next) => {

    const movie = await Movie.findById(req.params.id).populate('comments').lean();

    movie.comments.forEach(comment => {
        let createdDate = new Date(comment.createdDate);
        let dateAndTime = createdDate.toLocaleString('en-US', {
            month: 'long', // numeric, 2-digit, long, short, narrow
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit                        
            hour: 'numeric', // numeric, 2-digit
            minute: 'numeric', // numeric, 2-digit    
            hour12: true
        });

        comment.createdDate = dateAndTime;
    });

    if (!movie) {
        return next(new AppError('Movie doesnt exists', 404));
    }

    return resp.status(200).json({
        status: 200,
        data: movie
    });

});

exports.deleteMovie = catchAsync(async (req, resp, next) => {


    await Movie.findByIdAndDelete(req.params.id);
    return resp.status(204).json({
        status: 'success'
    });

});

exports.updateMovie = catchAsync(async (req, resp, next) => {

    if(req.file && req.file.filename && req.file.filename !== ''){
        req.body.picture = req.file?.filename;        
    }else{
        delete req.body.picture;        
    }
    
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    return resp.status(200).json({
        status: 'success',
        data: movie
    });
});

