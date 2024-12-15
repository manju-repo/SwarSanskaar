const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({
    name:{type:String},
    email: {type: String},
    phone: {type: String,minlength: 10,maxlength: 10,match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']},
    address:    [String],
    branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    monthly_fees: {type:Number},
    joining_date:{type:Date, default:()=>Date.now()},
    active: {type:Boolean},
    payments:[Object],
    reminder_enabled:{type:Boolean, default:true}
},{collection: 'Student'});

module.exports = mongoose.model("Student", StudentSchema);