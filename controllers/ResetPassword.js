const User = require('../models/User');
const mailSender = require('../utils/nodemailer');
const bcrypt=require('bcrypt');
//ResetPassword token

exports.resetPasswordToken = async () => {

    try {
        //get email from req ki body
        const { email } = req.body;
        //email ke upar validation
        if (!email) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please fill details correctly"
                }
            )
        }
        //check if user exists or not
        const checkUserPresesnt = await User.find({ email });

        if (!checkUserPresesnt) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User not registered"
                }
            )
        }

        //generate token
        const token = crypto.randomUUID;

        //update user by adding token aur expiration time


        const updatedUser = await User.findOneAndUpdate({ email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        })

        //url create karo lekin ye frontend ka hoga aur frontend 3000 port pe chalega

        const url = `localhost:3000/update-password/${token}`;

        //send mail jisme url hai  

        await mailSender(email, "Reset Password Link", `Reset Password link is : ${url}`);


        //return response
        return res.status(200).json(
            {
                success: true,
                message: "MAil containing url for reset Password successfully sent"
            }
        )

    }
    catch (err) {
        console.log(err);
        return res.status(500).json(
            {
                message: false,
                message: err.message
            }
        )
    }
}

//ResetPassword

exports.resetPassword = async (req, res) => {
    try {
        //data fetch -> password, confirmPassword aur token lekin token ko frontend ne dala hoga body mein
        const { password, confirmPassword, token } = req.body;
        //validation karenge
        if (password !== confirmpassword) {
            return res.status(400).json(
                {
                    success: falsse,
                    messgae: "pasword not matchimng"
                }
            )
        }


        //user ko find using the token

        const user = await User.findOne({
            token
        });
        //if no entry then token invalid

        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token INVALID !"
                }
            )
        }
        //agar entry hai bhi to timing of expiry check
        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token has expired "
                }
            )
        }

        //password ko hash

        const hashedPaassword= await bcrypt.hash(password,10);

        //update user ke andar password ko

        const updatedUser= await User.findOneAndUpdate({token},{password:hashedPassword},{new:true});

        return res.status(200).json(
            {
                 success:true,
                 message:"User password has successfully been reset"
            }
        )

    } catch (err) {

        console.error(err);
        return res.status(500).json(
            {
                success:false,
                message:err.message
            }
        )
    }
}