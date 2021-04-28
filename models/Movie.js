const mongoose = require('mongoose');
const slug = require('slug');
var uniqueValidator = require('mongoose-unique-validator');



const movieSchema = mongoose.Schema({
    title: {
        type: String,
        unique: [true, 'Title already exists. Please try again'],
        required: [true, 'Title is required'],
        maxLength: [30, 'Title should not be greater than 30 characters`;'],
        minLength: [3, 'Title should not be lesser than 3 characters`;'],
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release Year is required'],
        max: [2030, 'Release Year should not be greater than 2030`;'],
        min: [1910, 'Release Year should not be lesser than 1910`;'],
    },
    picture: {
        type: String
    },
    cast: {
        type: String,
        required: [true, 'Major Cast is required'],
        maxLength: [500, 'Major should not be greater than 500 characters`;'],
        minLength: [3, 'Major should not be lesser than 3 characters`;'],
    },
    storyLine: {
        type: String,
        required: [true, 'Story Line is required'],
        maxLength: [1000, 'Story Line should not be greater than 1000 characters`;'],
        minLength: [3, 'Story Line should not be lesser than 3 characters`;'],
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    titleSlug: {
        type: String
    }
});


movieSchema.set('toObject', { virtuals: true });
movieSchema.set('toJSON', { virtuals: true });

movieSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'movie',
    localField: '_id',
    options: { sort: { createdDate: -1 }}
});

movieSchema.pre('save', function(next){
    this.titleSlug = slug(this.title);
    next()
});

const movieModel = mongoose.model('Movie', movieSchema);
module.exports = movieModel;
