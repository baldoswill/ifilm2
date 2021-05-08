const {createLogger, transports, format} = require('winston');
require('winston-mongodb');


const logger = createLogger(
    {
        transports: [new transports.MongoDB({
            level: 'error',
            db: process.env.DB_ATLAS,
            collection: 'errors',
            format: format.combine(format.timestamp(), format.json())
        })]
    }
);

module.exports = logger;