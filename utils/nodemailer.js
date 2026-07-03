const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {

    const transporter = nodemailer.createTransport(
        {
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MIAL_PASS
            }
        }

    )

    //sending mail
    const info = await transporter.sendMail(
        {
            from:"StudyNotion||CodeHelp",
            to:email,
            subject:title,
            html:body
        }
    )

    console.log(info);

}


module.exports = mailSender;