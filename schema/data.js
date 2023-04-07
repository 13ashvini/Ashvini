const mongoose = require("mongoose")
const dataSchema=mongoose.Schema({
    name:String,
    email:String,
    mobilenumber:String,
    whatsappnumber:String,
    gender:String,
   dob:String,
   fees:String,
   coursename:String,
   address:String,
    workingexperience:String,
    company:String,
    createdBy:String

},
{timestamps:true})
module.exports=mongoose.model("data",dataSchema)
