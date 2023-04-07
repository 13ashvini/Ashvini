const mongoose=require("mongoose")
const StudentEnquire=mongoose.Schema({
  studentname:String,
  studentnumber:String,
  coursename:String,
feedback:String,
   
})

module.exports = mongoose.model("studentEnquire",StudentEnquire)
