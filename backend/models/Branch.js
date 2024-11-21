const mongoose = require("mongoose");


const BranchSchema = new mongoose.Schema({
    branch_name:{type:String},
    no_of_students: {type:Number},
    monthly_fees: {type:Number},
    address:[String],
},{collection: 'Branch'});

module.exports = mongoose.model("Branch", BranchSchema);