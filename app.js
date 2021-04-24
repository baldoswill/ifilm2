const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const cors = require('cors');
const app = express();
const movieRoutes = require('./routes/MovieRoutes');
const movieUiRoutes = require('./routes/MovieUiROute');
const categoryRoutes = require('./routes/CategoryRoute');
const categoryUiRoutes = require('./routes/CategoryUiRoutes');
const homeUiRoutes = require('./routes/HomeUiRoutes');
const userUiRoutes = require('./routes/UserUiRoutes');
const userRoutes = require('./routes/UserRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./utils/errorHandler');



app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));


nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use('/', homeUiRoutes);
app.use('/movies', movieUiRoutes);
app.use('/auth', userUiRoutes);
app.use('/categories', categoryUiRoutes);

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, resp, next) => {
    return next(new AppError('That resource doesnt exists. Please try again.', 404));
})

app.use(errorHandler);

module.exports = app;