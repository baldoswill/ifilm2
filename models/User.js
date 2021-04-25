const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var validator = require('validator');
const crypto = require('crypto');

// TODO: Guard Routes by authentication and authorization
const userSchema = mongoose.Schema({
    firstName: {
        type: String,        
        required: [true, 'First Name is required'],
        maxLength: [30, 'First Name should not be greater than 30 characters`;'],
        minLength: [3, 'First Name should not be lesser than 3 characters`;'],
    },
    lastName: {
        type: String,        
        required: [true, 'Last Name is required'],
        maxLength: [30, 'Last Name should not be greater than 30 characters`;'],
        minLength: [3, 'Last Name should not be lesser than 3 characters`;'],
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
        validate:[validator.isEmail, 'Email must be in the correct format. (eg: test@gmail.com)']
    },
    // TODO: regex for password
    password: {
        type: String,
        select: false,        
        required: [true, 'Password is required'],
        maxLength: [50, 'Password should not be greater than 50 characters`;'],
        minLength: [8, 'Password should not be lesser than 8 characters`;'],
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/, 'Password must have at least one number. Uppercase and special characters are optional']

    },
    confirmPassword:{
        type: String,
        required: [true, 'Confirm Password is required'],
        maxLength: [50, 'Confirm Password should not be greater than 50 characters`;'],
        minLength: [8, 'Confirm Password should not be lesser than 8 characters`;'],
        validate: {            
            validator: function(value){
                return value === this.password;
            },
            message: 'Password and Confirm Password should match.'
        },
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/, 'Confirm Password must have at least one number. Uppercase and special characters are optional']
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
        enum: ['admin','user'],
        default: 'user'
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
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePassword = async function(userInputtedPassword, dbPassword){

    return await bcrypt.compare(userInputtedPassword, dbPassword);
}

userSchema.statics.createRandomString = async function(){

    return new Promise((resolve, reject) => {
        try{
            resolve(crypto.randomBytes(32).toString('hex'));
        }catch(error){
            reject(error);
        }
    });

    
}

userSchema.statics.createToken = async function(randomString){    
    return new Promise((resolve, reject) => {
        try{
            resolve(crypto.createHash('sha256').update(randomString).digest('hex').trim());
        }catch(error){
            reject(error);
        }
    });

}

userSchema.statics.createExpirationDateTime = async function(){
    return Date.now() + 10 * 60 * 1000;    
    
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;