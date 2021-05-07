const AppError = require('./AppError');


const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err =>{
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)

    const message = `${value} already exists. Please try another value`.replace(/[^a-zA-Z.@ ]/g, " ");
    return new AppError(message, 400);
}

const handleValidationErrorDB = err =>{
    // El is the field name then message is the property of the field name error
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`

    return new AppError(message, 400);
}

const handleJSONWebTokenError = () => new AppError('Invalid token! Please login again.', 401);

const handleJSONWebTokenExpiredError = () => new AppError('Your token has expired! Please login again.', 401);

const sendErrorDev = (err, req, res) => {

    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    return res.status(500).render('error.html');
};

const sendErrorProd = (err,req, res) => {

    if(req.originalUrl.startsWith('/api')){

        if (err.isOperational){
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });

            // Programming or other unknown error: don't leak error details
        } else {
            // 1) Log error
            // console.error('ERROR 💥', err);

            // 2) Send generic message
            return res.status(502).json({
                status: 'error',
                message: err.message
            });
        }
    }

    return res.status(500).render('error.html');
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);


    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let trimmedENV = process.env.NODE_ENV.trim();

    if (trimmedENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (trimmedENV === 'production') {
        let error;

       

        if (err.name === 'CastError') error = handleCastErrorDB(err);

        if(err.code === 11000) error = handleDuplicateFieldsDB(err);

        if(err.name === 'ValidationError') error = handleValidationErrorDB(err);

        if(err.name === 'JsonWebTokenError') error = handleJSONWebTokenError();

        if(err.name === 'TokenExpiredError') error = handleJSONWebTokenExpiredError();

        if(!error) error = err;

        sendErrorProd(error, req, res);
    }
};