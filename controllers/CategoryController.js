const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');

exports.createCategory = catchAsync(async(req, resp,next) => {
    const category = await Category.create(req.body);

    return resp.status(201).json({
        status: 'success',
        data:category
    });
});

exports.getCategories = catchAsync(async(req, resp,next) => {

        req.query.limit = 5;
        const currentPage = req.query.page * 1 || 1
    
        const features = new ApiFeatures(Category.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
    
        const totalRows = await Category.count();
        const numberOfPages = Math.ceil(totalRows / req.query.limit);
        const categories = await features.query;
     
   
    return resp.render('category-list.html', {categories, currentPage, numberOfPages});
});


exports.getCreateCategory = catchAsync(async(req, resp,next) => {
    return resp.render('add-category.html');
});

