const mongoose = require("mongoose")
const courseSchema=mongoose.Schema({
   course:String 
},
{
   timestamps:true
   })
module.exports=mongoose.model("course",courseSchema)