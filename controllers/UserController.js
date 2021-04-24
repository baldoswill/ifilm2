const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const emailer = require('../utils/emailer');

// TODO: jwt and Cookie
// TODO: Roles
// TODO: Recently Password Changed at


// --------------------------------- SIGN UP -------------------------------------//

exports.getSignUp = catchAsync(async (req, resp, next) => {
    return resp.render('signup.html');
});

exports.postSignUp = catchAsync(async (req, resp, next) => {
    const { firstName, lastName, email, dob, password } = req.body;

    const randomString = await User.createRandomString();
    const validationToken = await User.createToken(randomString);
    const user = await User.create({ firstName, lastName, email, dob, password, validationToken });

    if (!user) {
        return next(new AppError('Registration unsuccessful. Please try again'));
    }

    try {
        const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verifyAccount/${randomString}`
        let message = `Please verify your account by clicking on this link ${verifyUrl}`;
        await emailer({
            subject: 'Validate Your Account',
            message,
            email
        });
    } catch (error) {
        // TODO: Logger is needed
        console.log(error);
    }

    return resp.status(201).json({
        status: 'success',
        message: 'Successfully Created'
    });
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

    return resp.status(200).json({
        status: 'success',
        message: 'Successfully Logged In',
        data: user
    })
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
            await user.save({ validateBeforeSave: true });            
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

    return resp.status(200).json({
        status: 'success',
        message: 'You successfully updated your password'
    });
});







