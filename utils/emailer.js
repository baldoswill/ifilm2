const nodemailer = require('nodemailer');

async function emailer(options) {

    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE.trim(),
            host: process.env.EMAIL_HOST.trim(),
            port: process.env.EMAIL_PORT.trim(),
            auth: {
                user: process.env.EMAIL_USER.trim(),
                pass: process.env.EMAIL_PASSWORD.trim()
            }
        });

        const mailOptions = {
            from: process.env.ADMIN_INFO.trim(),
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {                 
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
}

module.exports = emailer;
