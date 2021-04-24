const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');


exports.createCategory = catchAsync(async(req, resp,next) => {
    const category = await Category.create(req.body);

    return resp.status(201).json({
        status: 'success',
        data:category
    });
});


exports.getCreateCategory = catchAsync(async(req, resp,next) => {
    return resp.render('add-category.html');
});

