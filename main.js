const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const data = require("./schema/data")
const cors = require("cors")
const Enquires = require("./Enquire")
const studentEnquire = require("./studentEnquire")
const courses=require("./schema/course")
const course = require("./schema/course")
const app = express()
const addEnquiry = require("./controllers/EnquiryController")
const addregister=require("./controllers/loginController")
const alldata=require("./controllers/EnquiryController")
const singledata=require("./controllers/EnquiryController")
const update=require("./controllers/EnquiryController")
const deletedata=require("./controllers/EnquiryController")
const coursedata=require("./controllers/EnquiryController")
const multer=require("multer")
const jwt=require("jsonwebtoken")
const joi=require("joi")
const profile=require("./schema/profile")
const path=require("path")
app.use(cors())
app.use("/Documents",express.static("Documents"))
mongoose.connect("mongodb+srv://ashvinichoudhary1519:ashvini0000@cluster0.4qdkwvm.mongodb.net/datatest").then(() => {
    console.log("connected sucessfully")
}).catch((err) => {
    console.log("not connected")
})
let verifyToken= (async(req,res,next)=>{
    try{
        const token= await req.headers.authentication
        console.log(token,"------token-------")
        if(token===null){
            console.log("There is no token")
        }else{
            let decodes=jwt.verify(token,"mySecretKey")
            req.addregister=decodes
            console.log(decodes,"-------decodes----")
            // res.send({status:"ok",msg:"Dat verify Successfully"})
            next()
}

        }
        catch(err){
            console.log(err,"errorsssss")
            res.send({status:"err",msg:"token invalid"})
            

    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Documents')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}-${file.originalname}` )
    }
  })
  const upload=multer ({storage:storage,
limits:{fileSize:100000},
fileFilter:(req,file,cb)=>{
    checkFileType(file,cb)
}
})
const checkFileType=((file,cb)=>{
    const fileType=/jpg|jpeg|png|svg|gif/
    const extName=fileType.test(path.extname(file.originalname).toLowerCase())
    const mimeType=fileType.test(file.mimetype)
    if(mimeType && extName){
        return cb(null,true)
    }else{
        cb("Error:you can only upload jpg|jpeg|png|svg|gif images only")
    }
})
//   const validationiddleWare=(req,res,next)=>{
//     const Schema=joi.object({
//         name: joi.string()
//                 .alphanum()
//                 .min(3)
//                 .max(30)
//                 .required(),
//                 email: joi.string()
//                 // .alphanum()
//                 .min(3)
//                 .max(30)
//                 .required(),
//                 password: joi.string()
//                 // .alphanum()
//                 .min(3)
//                 .max(30)
//                 .required(),
//                 mobilenumber: joi.string()
//                 // .alphanum()
//                 .min(3)
//                 .max(30)
//                 .required(),
        
//         })
//         const {error}=Schema.validate(req.body,{aboutEarly:false})
//         if(error){
//             res.status(200).json({error:error})
//         }else{
//             next()
//         }
//   }

    
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const fileSchema=joi.object({
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        size:joi.number().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        mimetype:joi.string().required(),
        path:joi.string().required()
    }).required()
})
app.post('/profile', upload.single('image'), async(req, res, next)=> {
   const{error, value}=fileSchema.validate({file:req.file})
    if(error){
        console.log(error)
        return res.send({error:error})
    }
try{
   const name=req.file.path
   console.log(name)
   const file=req.file
   const profiles= await profile.create({name})
   res.send({status:"ok",msg:"File Uploaded Succsesfully",data:{profiles,file}})
}
catch{
    res.send({status:"error",msg:"something went wrong in upload file",data:null})  
}
    
   
  })

// ........... Router for register.......//
app.post("/register" ,addregister.addRegister)

// ----------------- Router for login -------------------//
app.post("/login",addregister.addLogin)

// -------Router for Data----------
app.post("/data",verifyToken, addEnquiry.addInquiry)

// -------Router for All Student---------
app.post("/alldata", alldata.alldata )

// -------Router for single student-------
app.get("/alldata/:getid",verifyToken,singledata.getsinglestudent)

// ------Router for update student---------
app.put("/alldata/:getid",verifyToken ,update.update)

// ---------Router for delete student-------
app.delete("/alldata/:getid",verifyToken, deletedata.delete)


// ----------Router for post course--------
app.post("/course", coursedata.coursedata)

app.get("/course" ,async(req,res)=>{
    try{
    
      const courses = await course.find({})
      res.send({status:"ok",msg:"Data fetched successfully",data:courses})
    } 
    catch{
      res.send({status:"err",msg:"somethind went wrong",data:null})
    }
  })


  app.post("/filter" ,async(req,res)=>{
    try{
  
        const {coursename,fees}=req.body
        
               let filter= await data.aggregate([

            {$match:{$and:[
                {
   coursename:{$in:["javascript","Html-CSS"]}},
  {fees:{$gt:"2000",$lt:"6000"}}
]}
}
            
        ])
        res.send({Status:"ok",msg:"Data filtered sucessfully",data: filter})
    
    }
    catch(err){
        res.send({status:"err",msg:"SOmething went wrong",data:null, errosr:err.toString()})
    }
})




app.get("/get_followup_by_enquireid/:studentid", async (req, res) => {
    let { studentid } = req.params
    const { enquires_id, is_communicated, summary, next_followup_require, next_followup_enquires_date_time } = req.body
    let enquireToInserted = {
        enquires_id, is_communicated, summary, next_followup_require, next_followup_enquires_date_time
    }
    try {
        await Enquires.create(enquireToInserted)
        res.send({ status: "OK", msg: "Data Posted succesfuly", data: null })
    }
    catch (err) {
        res.send({ status: "err", msg: "something went wrong" })
    }
})

app.listen(2358, () => {
    console.log("server is running")
})  