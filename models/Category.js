const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Category already exists. Please try again'],
        required: [true, 'Category is required'],
        maxLength: [30, 'Category should not be greater than 30 characters`;'],
        minLength: [3, 'Category should not be lesser than 3 characters`;'],
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;