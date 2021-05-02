const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');
const emailer = require('../utils/emailer');


// --------------------------------- Create Jwt Token -------------------------------------//

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET.trim(), {expiresIn: process.env.JWT_EXPIRATION.trim()});
}

// --------------------------------- Create Status Codes -------------------------------------//

const createSendToken = (user, statusCode, resp) => {
    const token = signToken(user.id);    

    const cookieOption = {
        maxAge: process.env.JWT_EXPIRATION.trim() * 24 * 60 * 1000,
        httpOnly: true
    }

    if(process.env.NODE_ENV.trim() === 'production'){
        cookieOption.secure = true;
    }

    resp.cookie('userToken', token, cookieOption);

    user.password = undefined;
    user.confirmPassword = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationTimeStamp = undefined;

    return resp.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });

}

exports.protect = catchAsync(async (req, resp, next) => {  
    
    try {

        let token;    
 
 
        if(!req.headers.authorization && !req.cookies['userToken']){
            return next(new AppError('Please login to your account', 401));
        }
    
    
    
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[2] || req.headers.authorization.split(' ')[1];   
                  
        }else if(req.cookies['userToken'] && req.cookies['userToken'] !== ''){
            token = req.cookies['userToken'];
           
        }    
    
        if(!token || token === ''){
            return next(new AppError('Please login to your account', 401));
        }
    
         const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET.trim());
         const user = await User.findById(decodedToken.id);
     
         if(!user){
            return next(new AppError('Please login to your account', 401));
        }
    
        if(user.recentlyChangedPassword(decodedToken.iat)){
            resp.cookie('userToken', '', {
                maxAge: 0
            });
            return next(new AppError('Recently changed password. Please login back to your account', 401));
        }
     
        req.user = user;
        resp.locals = user;
      
        
    } catch (error) {
        console.log(error)
    }
   
    next();

});
 

// --------------------------------- SIGN UP -------------------------------------//

exports.getSignUp = catchAsync(async (req, resp, next) => {
    return resp.render('signup.html');
});

exports.postSignUp = catchAsync(async (req, resp, next) => {
    const { firstName, lastName, email, dob, password, confirmPassword } = req.body;

    const randomString = await User.createRandomString();
    const validationToken = await User.createToken(randomString);
    const user = await User.create({ firstName, lastName, email, dob, password, validationToken, confirmPassword });

    if (!user) {
        return next(new AppError('Registration unsuccessful. Please try again'));
    }

    try {
        const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verifyAccount/${randomString}`
        let message = `Please verify your account by clicking on this link ${verifyUrl}`;
    
        await emailer({
            subject: 'Verify Your Email',
            message,
            email
        });

    } catch (error) {
        // TODO: Logger is needed
        console.log(error);
    }

    createSendToken(user, 201, resp);
});


// --------------------------------- LOG IN  -------------------------------------//

exports.getLogin = catchAsync(async (req, resp, next) => {
    return resp.render('login.html');
});

exports.postLogin = catchAsync(async (req, resp, next) => {

    if(typeof(req.body.email) === "undefined" || req.body.email === ''){
        return next(new AppError('Email is required', 400));
    }

    if(typeof(req.body.password) === "undefined" || req.body.password === ''){
        return next(new AppError('Password is required', 400));
    }


    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new AppError('Incorrect email. Please try again', 404));
    }
   
    const doesUserMatchedPassword = await user.comparePassword(password, user.password);

    if (!doesUserMatchedPassword) {
        return next(new AppError('Incorrect password. Please try again', 401))
    }

    if(!user.isActive){
        return next(new AppError('Your account still haven\'t been verified. Please check your email for the verification link', 401));
    }

    createSendToken(user, 200, resp);
});


// --------------------------------- VERIFY ACCOUNT -------------------------------------//

exports.verifyAccount = catchAsync(async (req, resp, next) => {
    let verifyToken = req.params.verifyToken;
    
    let validationToken = await User.createToken(verifyToken);
    

    const user = await User.findOne({ validationToken });
    
    let isVerified = false;

    if (user) {        
        if(!user.isActive){
            user.isActive = true;
            user.validationToken = undefined;
            await user.save({ validateBeforeSave: false });            
        }
        isVerified = true;    
    }

    return resp.render('verifyAccount.html', { isVerified });
});

exports.sendVerificationEmail = catchAsync(async (req, resp, next) => {

    if(typeof(req.body.email) === "undefined" || req.body.email === ''){
        return next(new AppError('Email is required', 400));
    }

    const email = req.body.email;
    let user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email is incorrect. Please try again', 404));
    }

    try {

        if(user.isActive){
            return next(new AppError('That email is already verified.', 400));
        }else{
            const randomString = await User.createRandomString();
            user.validationToken = await User.createToken(randomString);
            await user.save({ validateBeforeSave: false });
    
            const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verifyAccount/${randomString}`
            let message = `Please verify your account by clicking on this link ${verifyUrl}`;
            await emailer({
                subject: 'Validate Your Account',
                message,
                email
            });
        }       

    } catch (error) {
        console.log(error);
    }

    return resp.status(200).json({
        status: 'success',
        message: 'Successfully sent verification link to email'
    });
});


// --------------------------------- FORGOT PASSWORD -------------------------------------//

exports.getForgotPassword = catchAsync(async (req, resp, next) => {
    return resp.render('forgot-password.html');
});

exports.postForgotPassword = catchAsync(async (req, resp, next) => {

    if(typeof(req.body.email) === "undefined" || req.body.email === ''){
        return next(new AppError('Email is required', 400));
    }

    const email = req.body.email;

    const user = await User.findOne({email});

    if(!user){
        return next(new AppError('User doesnt exists with that email', 404));
    }

    try {
        const randomString = await User.createRandomString();
        const passwordResetToken = await User.createToken(randomString); 

        user.passwordResetToken = passwordResetToken;
        user.passwordResetTokenExpirationTimeStamp = await User.createExpirationDateTime();

        await user.save({validateBeforeSave: false});

        const verifyUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${randomString}`
        let message = `You can reset your password by clicking on this link ${verifyUrl}`;
        await emailer({
            subject: 'Reset Password',
            message,
            email
        });
    } catch (error) {
        // TODO: Logger is needed
        console.log(error);
    }


    return resp.status(200).json({
        status: 'success',
        message: 'Successfully sent reset password link to email'
    });
});


// --------------------------------- RESET PASSWORD -------------------------------------//

exports.getResetPassword = catchAsync(async (req, resp, next) => {
    if(typeof(req.params.passwordToken) === "undefined" || req.params.passwordToken === ''){
        return resp.render('error.html');
    }      

    const passwordResetToken = await User.createToken(req.params.passwordToken);    
    const user = await User.findOne({passwordResetToken, passwordResetTokenExpirationTimeStamp : {$gt: Date.now()}});
    
    if(!user){
        return resp.render('error.html');
    }

    return resp.render('reset-password.html');
});

exports.postResetPassword = catchAsync(async (req, resp, next) => {
    if(typeof(req.body.password) === "undefined" || req.body.password === ''){
        return next(new AppError('Password is required', 400));
    }

    if(typeof(req.body.confirmPassword) === "undefined" || req.body.confirmPassword === ''){
        return next(new AppError('Confirm Password is required', 400));
    }

    const {password, confirmPassword} = req.body;

    const passwordResetToken = await User.createToken(req.params.passwordToken);     
    const user = await User.findOne({passwordResetToken, passwordResetTokenExpirationTimeStamp : {$gt: Date.now()}});
    
    if(!user){
        return next(new AppError('Password Reset has expired. Please try again', 400));
    }

    if(password !== confirmPassword){
        return next(new AppError('Password and confirm password doesnt match. Please try again', 400));
    }

    user.password = password;    
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationTimeStamp = undefined;

    user.save({validateBeforeSave: false});

    createSendToken(user, 200, resp);
});


exports.postUpdatePassword = catchAsync(async (req, resp, next) => {
    if(!req.user){
        return next(new AppError('You must be login to do this action', 401));
    }

    const user = await User.findById(req.user.id);

    if(!user){
        return next(new AppError('You must be login to do this action', 401));
    }

    if(typeof(req.body.password) === "undefined" || req.body.password === ''){
        return next(new AppError('Password is required', 400));
    }

    if(typeof(req.body.confirmPassword) === "undefined" || req.body.confirmPassword === ''){
        return next(new AppError('Confirm Password is required', 400));
    }

    const {password, confirmPassword} = req.body;
    
    user.password = password;
    user.confirmPassword = confirmPassword;

    await user.save();

    createSendToken(user, 200, resp);
});

// --------------------------------- Roles -------------------------------------//

exports.restrictTo = (...roles) => {    

   
    return (req, resp,next) => {

        try {
            if(!req.user){

                return next(new AppError('You are not allowed to do this action', 403));
            }
            else if(!roles.includes(req.user.roles)){
                return next(new AppError('You are not allowed to do this action', 403));
            }
        } catch (error) {
            console.log(error)
        }
       

        next();
    }
};


// ---------------------------- Get all Users ----------------------
 

exports.getAllUsers = catchAsync(async (req, resp, next) => {
    if(!req.user){
        return next(new AppError('You must be login to do this action', 401));
    }

    const users = await User.find();

    resp.status(200).json({
        status: 'success',
        data: users
    })
});

exports.getUsers = catchAsync(async (req, resp, next) => {

    req.query.limit = 8;
    const currentPage = req.query.page * 1 || 1

    const features = new ApiFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const totalRows = await User.count();
        const numberOfPages = Math.ceil(totalRows / req.query.limit);
        const users = await features.query.lean();

        users.forEach(user => {
            user.dob = moment(user.dob).format('ll');
        });
   
    resp.render('user-list.html', {users, currentPage, numberOfPages});
});

exports.logout = catchAsync(async (req, resp, next) => {

    console.log('LOGOUT')
    
    resp.cookie('userToken', '', {
        maxAge: 0
    });

    if(req.user){
        req.user = undefined;
    }

    if(req.locals.user){
        req.locals.user = undefined;
    }

    if(req.headers.authorization){
        req.headers.authorization = undefined;
    }
     
    resp.status(200).json({
        status: 'success'       
    })
});





