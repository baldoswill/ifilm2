const app = require('./app');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

let port = process.env.PORT || 5000;

mongoose.connect(process.env.DB_ATLAS, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then().catch(error => logger.error(error.message));

app.listen(port, () => {
    console.log(`running on ${port} `);    
});

