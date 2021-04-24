const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const crypto = require('crypto');

// TODO: Schema Validation
// TODO: Roles
// TODO: Guard Routes by authentication and authorization
const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        unique: [true, "Email already exists. Please try again"],
        required: [true, 'Email is required'],
        maxLength: [30, 'Email should not be greater than 30 characters`;'],
        minLength: [3, 'Email should not be lesser than 3 characters`;'],
    },
    password: {
        type: String,
        select: false
    },
    confirmPassword:{
        type: String
    },
    validationToken: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpirationTimeStamp:{
        type: Number
    },
    roles: {
        type: String,
        enum: ['admin','user']
    }
},{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.comparePassword = async function(userInputtedPassword, dbPassword){

    return await bcrypt.compare(userInputtedPassword, dbPassword);
}

userSchema.statics.createRandomString = async function(){
    return crypto.randomBytes(32).toString('hex');
}

userSchema.statics.createToken = async function(randomString){
    return crypto.createHash('sha256').update(randomString).digest('hex').trim();
    
}

userSchema.statics.createExpirationDateTime = async function(){
    return Date.now() + 10 * 60 * 1000;    
    
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;