const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, title, body) => {
    try {

        //STEP 2 : CREATING TRANSPORTER

        const transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            }

        )

        // SENDING MAIL
         
        const info = await transporter.sendMail(
            {
                from: "StudyNotion||CodeHelp",
                to: email,
                subject: title,
                html: body
            }
        )

        console.log(info);

    } catch (err) {


    }

}


module.exports = mailSender;