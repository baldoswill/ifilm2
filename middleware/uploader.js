const pathExpress = require('path')
const fs = require('fs');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '--' + file.originalname);
    }
});

const upload = multer({
        storage       
    }
);


module.exports = upload;