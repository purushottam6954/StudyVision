const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.body || req.cookies.token || req.header("Authorisation").replace("Bearer ", "");

        if (!token) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token does not exist"
                }
            )
        }

        //check if token is valid or not
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (err) {
            console.error(err);
            res.status(401).json(
                {
                    success: false,
                    message: "Token mein kuch issue hai"
                }
            )
        }

        next();



    } catch (err) {

        console.log(err);
        res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }

}

//isStudent
exports.isStudent = async (req, res, next) => {

    try {

        if(req.user.accountType!=="Student"){
            return res.status(400).json(
                {
                    success:false,
                    message:"Protected route for Students Only"
                }
            )
        }

        next();
    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}

//isInstructor

exports.isInstructor = async (req, res, next) => {

    try {

        if(req.user.accountType!=="Instructor"){
            return res.status(400).json(
                {
                    success:false,
                    message:"Protected route for Instructor Only"
                }
            )
        }

        next();
    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}

//isAdmin

exports.isAdmin = async (req, res, next) => {

    try {

        if(req.user.accountType!=="Admin"){
            return res.status(400).json(
                {
                    success:false,
                    message:"Protected route for Admin Only"
                }
            )
        }

        next();
    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}