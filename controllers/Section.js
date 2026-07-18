const Section = require('../models/Section');
const Course = require('../models/Course');


//CREATE SECTION HANDLER FUNCTION
exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;

        //validation
        if (!sectionName || !courseId) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Missing Properties"
                }
            )
        }

        //create section
        const newSection = await Section.create({ sectionName });
        // update Course by add Section id in courseContent

        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, { $push: { courseContent: newSection._id } }, { new: true }).populate("courseContent").exec();

        return res.status(200).json(
            {
                success: true,
                message: "Section created successfully"
            }
        );


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


//UPDATE SECTION HANDLER FUNCTION
exports.updateSection = async (req, res) => {
    try {
        //fetch data
        const { sectionName, sectionId } = req.body;

        //validate data
        if (!sectionName || !sectionId) {
            return res.status(400).json(
                {
                    success: false,
                    mesage: "Please fill data correctly"
                }
            )
        }

        //update Data
        const newSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        return res.status(200).json(
            {
                success: true,
                message: "Data updated successfully"
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

exports.deleteSection=async(req,res)=>{

    try{

        //assuming that we are sending the id in params

    }
    catch(err){



    }

}