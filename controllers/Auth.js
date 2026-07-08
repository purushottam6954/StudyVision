const User = require('../models/User');
const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//otpSend

exports.sendOtp = async (req, res) => {
    try {

        //fetch email from request ki body
        const { email } = req.body;

        //check if USer already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: "User already registered"
                }
            )
        }

        //if NOT then generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: flase,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        let result = Otp.findOne({ id });

        while (result) {
            otp = otpGenerator.generate({
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
        }


        console.log("OTP generated is : ", otp)

        const otpPayload = { email, otp };

        const otpBody = await Otp.create(otpPayload);

        return res.status(200).json(
            {
                success: true,
                message: 'Otp sent successfully'
            }
        )




    } catch (err) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )

    }
}
//signup


exports.signup = async (req, res) => {

    try {
        //data fetch from req ki body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        //data validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {

            return res.status(404).json(
                {
                    success: false,
                    message: "Please fill all details correctly"
                }
            )
        }

        //password match

        if (password != confirmPassword) {

            return res.staus(400).json(
                {
                    success: false,
                    message: "Password and ConfirmPassword values do not match. Please Try Again!! "
                }
            )
        }

        //check user already exists or not

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: "User already registered"
                }
            )
        }

        //find most recent otp for the user
        const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);

        console.log(recentOtp);

        //validate Otp
        if (recentOtp.length == 0) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Otp not found"
                }
            )
        }
        else if (otp != recentOtp) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid Otp"
                }
            )
        }

        //hashPassword( Otp validate ho chuka)

        const hashedPassword = await bcrypt.hash(password, 10);

        //DB mein entry create

        const profileData = await Profile.create(
            {
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: contactNumber
            }
        )

        //kyuki User mein additionalDetails wali field required true hai

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            additionalDetails: profileData._id,
            image: `https://api.dicebear.com/10.x/adventurer/svg?seed=${firstName} ${lastName}`
        })

        //return res
        return res.status(200).json(
            {
                success: true,
                message: "USer successfuly created",
                user
            }
        )


    } catch (err) {



    }
}
//login

exports.login = async (req, res) => {

    try {

        //data fetch from request ki body

        const { email, password } = req.body;

        //validations run karenge

        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All Fields are required Please fill details correctly"
                }
            )
        }
        //check if user already exists

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json(
                {
                    success: true,
                    message: "User does not exist. Please signup first"
                }
            )
        }
        //compare password

        if (! await bcrypt.compare(password, user.password)) {

            return res.status(400).json(
                {
                    success: false,
                    message: "Password does not match"
                }
            )
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.accountType
        }
       
        //token generate

         const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        })

        user.token = token;
        user.password = undefined;

        //create cookie and send password

        const options={
            expires:new Date(Date.now()+3*24*60*60*1000), 
            httpOnly:true
        }
        res.cookie("token", token, options).status(200).json(
            {
                success:true,
                token,user,
                message:"User sucessfully logged in"
            }
        )

    } catch (err) {
        res.status(500).json(
            {
                success:false,
                error:err.message
            }
        )

    }
}

//changePassword
