const register = require("../registerShcema")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const saltRound=10
const joi=require("joi")
const Schema=joi.object({
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
            password: joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
            confirmPassword:joi.ref("password"),
            mobilenumber: joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
    
    })
// ----------------Api for Register------------------//
module.exports.addRegister = (async (req, res) => {
    try {

        let { name, email, password, confirmPassword, mobilenumber } = req.body
        const {error,value}=Schema.validate(req.body,{
            aboutEarly:false
        });
        if(error){
            console.log(error)
            return res.send({error:error})
        }
        let registerStudent=await bcrypt.hash(password,saltRound)
        console.log(registerStudent)
    let registerToInsert = { name, email, password:registerStudent, confirmPassword, mobilenumber }
    let registerd = await register.create(registerToInsert)
        console.log(registerd)
        res.send({ status: "ok", msg: "Data Registerd Successfully", data: registerd })

    } catch (e) {
        res.send({ err: "err", msg: "something went wrong" })
        console.log(e, "err")
    }

})

// --------------Api for login---------------//
const LoginSchema=joi.object({
    email: joi.string()
    // .alphanum()
    .min(3)
    .max(30)
    .required(),
    password: joi.string()
    // .alphanum()
    .min(3)
    .max(30)
    .required(),
            })
module.exports.addLogin=(async(req,res)=>{
    const {email,password}=req.body
    const secret="mySecretKey"
    
try{
    const {error,value}=LoginSchema.validate(req.body,{
        aboutEarly:false
    });
    if(error){
        console.log(error)
        return res.send({error:error})
    }
       let login=await register.findOne({email})
        // res.send({status: "ok", msg: "Data login Successfully", data: login })
        if(!login){
            res.send("user is not found")
        }else{
            bcrypt.compare(password, login.password).then(function(result){
                const token=jwt.sign({_id:login._id},secret)
                console.log(token)
                result ? res.send({status:"OK",msg:"user login Succesfully",data:login,token})
                :
                res.send({msg:"user can not login"})
            })
        }
    }
    catch(err){
        res.send({status: "err", msg: "something went wrong"})
console.log(err,"errrrr")
    }
})