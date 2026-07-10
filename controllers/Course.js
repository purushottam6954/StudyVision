const Course = require('../models/Course');
const User = require('../models/User');
const tag = require('../models/Tag');
const uploadFileToCloudinary = require('../utils/imageUploader');
require('dotenv').config();

//create course Handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch details
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        //Fetch Thumbnail
        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {

            return res.status(400).json(
                {
                    success: true,
                    message: "Please fill details carefully"
                }
            )
        }

        //check for instructor

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details : ", instructorDetails)

        if (!instructorDetails) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Instructor details not found"
                }
            )
        }

        //check given tag is valid or not

        const tagDetails = await Tag.findById(tag);

        if (!tagDetails) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Tag doesn't exist"
                }
            )
        }

        //upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)


        //create an entry for new course
        const newCourse = await Course.create(
            {
                couseName,
                courseDescription,
                whatYouWillLearn,
                instructor: instructorDetails._id,
                price,
                tag: tageDetails._id,
                thumbnail: thumbnailImage.secure_url
            }
        )

        //user ko update karna kyuki instructor hai to usko buy karne ki need nahi  
        //adding to userSchema of instructor 
        const newUser = await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        //update Tag ka SChema me
        const newTag = await Tag.findByIdAndUpdate(tag, { $push: { couses: newCourse._id } })

    }
    catch (err) {

        return res.status(500).json(
            {
                success: true,
                message:
            }
        )


    }
}


//getCourses Handle Function
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            couseName: true,
            courseDescription: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json(
            {
                success:true,
                message:"Data fetched successfully",
                data:allCourses
            }
        )

    }
    catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}