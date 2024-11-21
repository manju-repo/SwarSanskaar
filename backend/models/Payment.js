const mongoose = require("mongoose");


const PaymentSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    amount_due: {type:Number},
    due_date:{type:Date, default:()=>Date.now()+7 * 24 * 60 * 60 * 1000},
    amount_paid: {type:Number},
    date_of_payment:Date,
    payment_mode: {type:String},
    payment_status: {type:String, default:'pending'}
},{collection: 'Payment'});

module.exports = mongoose.model("Payment", PaymentSchema);