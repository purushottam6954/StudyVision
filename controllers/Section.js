const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;

        //validation
        if(!sectionName || ! courseId){
            return res.status(400).json(
                {
                     success:false,
                     message: "Missing Properties"
                }
            )
        }

        //create section
        const newSection= await Section.create({sectionName});
        // update Course by add Section id in courseContent

        const updatedCourseDetails= await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true}).populate("courseContent").exec();

        return res.status(200).json(
            {
                success:true,
                message:"Section created successfully"
            }
        );


    }
    catch (err) {

        return res.status(500).json(
            {
                success:false,
                message:err.message
            }
        )

    }
}