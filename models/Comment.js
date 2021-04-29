const mongoose = require('mongoose');
const User = require('./User');
const Movie = require('./Movie');

const commentSchema = mongoose.Schema({
    commentBody: {
        type: String,             
    },rating: {
        type: Number,
        default: 0
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


commentSchema.statics.calculateRatings = async function (movieId) {
    const stats = await this.aggregate([
        {
            // Get all the reviews on Review Schema using match tourId
            $match: { movie: movieId }
        },
        {            
            $group: {
                _id: 'movie',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    
    if (stats.length > 0) {
        await Movie.findByIdAndUpdate(movieId, {             
            totalRating: stats[0].avgRating,
        });
    } else {
        await Movie.findByIdAndUpdate(movieId, {        
            totalRating: 4.5
        });
    }
}
 
commentSchema.post('save', function () {   
    this.constructor.calculateRatings(this.movie);
});

commentSchema.pre(/^findOneAnd/, async function (next) {    
    this.comm = await this.findOne();
    next();
});

commentSchema.post(/^findOneAnd/, async function (next) {    
    await this.comm.constructor.calculateRatings(this.comm.movie);
});

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;