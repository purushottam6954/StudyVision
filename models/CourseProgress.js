const monngoose=require('mongoose')


const courseProgressSchema=new mongoose.Schema(
    {
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },

        commpletedVideos:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"SUbsection"
            }
        ]
    }
)

module.exports=mongoose.model("CourseProgress",courseProgressSchema)