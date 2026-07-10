const mongoose=require('mongoose')

const tagSchema=new mongoose.SChema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true
        },
        course:[{
            type:mongoose.Schema.types.ObjectId,
            ref:"Course"
        }]
    }
)

module.exports=mongoose.model("Tag",tagSchema);