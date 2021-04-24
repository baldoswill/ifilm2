const nodemailer = require('nodemailer');

const emailer =async options =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST.trim(),
        port: process.env.EMAIL_PORT.trim(),
        auth: {
            user: process.env.EMAIL_USER.trim(),
            pass: process.env.EMAIL_PASSWORD.trim()
        }
    });

    // 2) Definte the email options
    const mailOptions = {
        from: process.env.ADMIN_INFO.trim(),
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = emailer;
