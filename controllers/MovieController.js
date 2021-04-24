const Movie = require('../models/Movie');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');


exports.createMovie = catchAsync(async(req, resp,next) => {

        if(typeof(req.file) === "undefined" || typeof(req.body) === "undefined"){
            return next(new AppError('All fields are required'));
        }

        req.body.picture = req.file.filename;
        const movie = await Movie.create(req.body);

        return resp.status(201).json({
            status: 'success',
            data:movie
        });
});

exports.getCreateMovie = catchAsync(async(req, resp,next) => {
    const categories = await Category.find();
    return resp.render('add-movie.html', {categories});
});

exports.getAllMovies = catchAsync(async(req, resp,next) => {
    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

    const movies = await features.query
    return resp.render('main.html', {movies});
});

exports.getMovieBySlug = catchAsync(async(req, resp,next) => {
    const movie = await Movie.findOne({titleSlug: req.params.titleSlug});
    return resp.render('movie-details.html', {movie});
});

