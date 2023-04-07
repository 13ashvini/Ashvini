const mongoose = require("mongoose")

const EnquireSchema=mongoose.Schema({
    enquires_id:String,
    is_communicated:String,
    summary:String,
    next_followup_require:String,
    next_followup_enquires_date_time:String,
   
})

module.exports = mongoose.model("enquires",EnquireSchema)
