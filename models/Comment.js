const mongoose = require('mongoose');
const User = require('./User');

const commentSchema = mongoose.Schema({
    commentBody: {
        type: String,       
        required: [true, 'Comment Body is required'],
        maxLength: [1000, 'Comment Body should not be greater than 30 characters`;'],
        minLength: [5, 'Comment Body should not be lesser than 5 characters`;'],
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdDate:{
        type: Date,
        default: Date.now()
    },
    userFirstName: {
        type:String
    }
});

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });

commentSchema.pre('save', async function(next){   
    const user = await User.findById(this.user);
    this.userFirstName = user.firstName;
    next();
});


const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;