const mongoose= require('mongoose')
const registerSchema=mongoose.Schema({
name:String,
email:String,
password:String,
confirmPassword:String,
mobilenumber:String
},
{
timestamps:true
})
module.exports=mongoose.model("register",registerSchema)