const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

// const DB_LOCAL ='mongodb://localhost:27017/ifilm';

mongoose.connect(process.env.DB_LOCAL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then().catch(error => console.log(error));

app.listen(8000, () => {
    console.log(`running on 8000 `);
});