const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'jorisbourdin.pro@gmail.com',
        pass: 'lmmahzqlojyssnwn'
    }
});
