const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: {
        type: String,       
        required: [true, 'Comment is required'],
        maxLength: [1000, 'Comment should not be greater than 30 characters`;'],
        minLength: [5, 'Comment should not be lesser than 5 characters`;'],
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;