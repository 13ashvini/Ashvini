const data = require("../schema/data")
const courses =require("../schema/course")
const jwt =require("jsonwebtoken")
// ----------------APi for add Enquire--------//
const joi=require("joi")
const AddSchema=joi.object({
    name: joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
            email: joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            mobilenumber: joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            address:joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            dob:joi.string()
            // .alphanum()
            .min(3)
            .max(10)
            .required(),
            workingexperience:joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            fees:joi.string()
            // .alphanum()
            .min(3)
            .max(10)
            .required(),
            company:joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            coursename:joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
    
    })
exports.addInquiry = (async (req, res) => {
    try {
        const {error,value}=AddSchema.validate(req.body,{
            aboutEarly:false
        });
        if(error){
            console.log(error)
            return res.send({error:error})
        }
   const { name, email, mobilenumber, whatsappnumber, gender, dob,fees,coursename, address, workingexperience, company,createdBy } = req.body
    data.create({ name, email, mobilenumber, whatsappnumber, gender, dob,fees,coursename, address, workingexperience, company,createdBy })

   res.send("Data created succesfully")

    }
    catch(err)  {
        res.send("Data not Created")
    }
 }) 
// ------------Api for all student-----------------
exports.alldata=(async( req,res)=>{
    let { query, page, limit, sortBy, sortType } = req.body
    page = page ? page:1
    limit = limit ? limit:5
    sortBy= sortBy ? sortBy:"name"
    sortType= sortType ? sortType:"ASC"
    try {
        const params=["name","mobilenumber","email","dob",,"fees","coursename","address","workingexperience","company"]
        console.log(query)
        let searchQuery=[]
        for(let each in params){
            let searchKey=params[each]
            let value={$regex:`.*${query}.*`, $options: ''}   
            searchQuery.push({[searchKey]:value})
        }
     console.log(searchQuery)
         let datas = await data.aggregate([
            {$match: {$or:searchQuery}},
            {$sort:{[sortBy]: sortType==="ASC" ? 1: -1}},
            {$skip:(page-1)*limit},
            {$limit:limit} 
            
        ])
        let count = await data.aggregate([
            { $match: {} },
            {$count:"totalCount"},          
            {$limit:limit} 
        ])
        res.send({ status: "ok", msg: "Data posted succesfully", data: {datas,count} })
    }
    catch(err) {
        res.send({ status: "err", msg: "something went wrong", data: null })
        console.log(err)
    }
})
// ----------------Api for single student--------------//
exports.getsinglestudent=(async(req,res)=>{
    let { getid } = req.params
    //  console.log(getid)
    let datas = await data.findOne({ _id: getid })
    res.send(datas)
})
//  ----------- Api for  update------------------//
exports.update=(async(req,res)=>{
    const { name, email, mobileNumber, whatsappnumber, gender, dob,fees, coursename,address, workingexperience, company } = req.body
    let { getid } = req.params
    try {
        let datas = await data.findByIdAndUpdate({ _id: getid }, { $set: { name, email, mobileNumber, whatsappnumber, gender, dob,fees, coursename,address, workingexperience, company } })
        res.send({status:"ok",msg:"Data updated successfully",data:null})
    } catch (Err) {
        res.send({ status: "err", msg: "something went wrong", data: null })
    }
})
// ------------Api for delete---------------//
exports.delete=(async(req,res)=>{
    let { getid } = req.params
    try {
        await data.findOneAndDelete({ _id: getid })
        res.send({ status: "ok", msg: "Data deleted successfully", data: null })
    } catch (Err) {
        res.send({ status: "err", msg: "Something went wrong", data: null })
    } 
})
// ------------APi for post course----------//
exports.coursedata=(async(req,res)=>{
    const { course } = req.body
    courses.create({ course}).then((db) => {
        res.send({status:"ok",msg:"course created successfully",data:course})
    }).catch((err) => {
        res.send("Data not Created")
    })
})
// -----------APi for get Course---------//


