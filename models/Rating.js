const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    rate: {
        type: Number,
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
});

ratingSchema.set('toObject', { virtuals: true });
ratingSchema.set('toJSON', { virtuals: true });

const ratingModel = mongoose.model('Rating', ratingSchema);

module.exports = ratingModel;