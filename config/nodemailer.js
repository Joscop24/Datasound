const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'jorisbourdin.pro@gmail.com',
        pass: 'lmmahzqlojyssnwn'
    }
});

module.exports = transporter