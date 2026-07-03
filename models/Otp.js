const mongoose = require('mongoose');
const mailSender = require('../utils/nodemailer');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        expires: 5 * 60
    },
    otp:{
        type:String,
        trim:true
    }
})


async function sendVerificationMail(email, otp) {
    try {

        const mailResponse = await mailSender(email, "Verification mail from StudyNotion", otp)

        console.log(mailResponse)
    } catch (err) {

        console.log("Error occured while Sending mails for OTP", err)
    }
}

OtpSchema.pre('save', async(next)=>{
    await sendVerificationMail(this.email, this.otp ) //not fully understood by me
})

module.exports = mongoose.model("OTP", otpSchema);