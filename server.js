const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
let port = process.env.PORT || 5000;
// const DB_LOCAL ='mongodb://localhost:27017/ifilm';

mongoose.connect(process.env.DB_ATLAS, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then().catch(error => console.log(error));

app.listen(port, () => {
    console.log(`running on ${port} `);
});