const fs = require('fs');
const AppError = require('../utils/AppError');

module.exports =  async(req,resp, next) => {

    let name = req.file.filename;
    let image = req.file.path

    if(!(req.file.mimetype).includes('jpg')
        && !(req.file.mimetype).includes('png')
        && !(req.file.mimetype).includes('bmp')
        && !(req.file.mimetype).includes('jpeg')){
        fs.unlinkSync(image);

        return next(new AppError('File Type is not supported', 400));
    }

    if(req.file.size > 1024 * 1024){
        fs.unlinkSync(image);
        return next(new AppError('File is too large', 400));
    }

    if(!name || !image){
        return next(new AppError('Image is required', 400));
    }


    next();
}
