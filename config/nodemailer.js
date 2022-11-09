// require("dotenv").config();
const nodemailer = require("nodemailer");

const { MAIL, PASS } = process.env;


exports.transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL,
        pass: PASS
              
    }
});
