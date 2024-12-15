const Payment=require("../models/Payment");
const Student=require("../models/Student");

const cron = require('node-cron');

const createPayment = async () => {
    try {
        const currentDate = new Date();
        const students = await Student.find();

        /*for (const student of students) {
            const newPayment = new Payment({
                student_id: student._id,
                amount_due: student.monthly_fees
            });
            console.log("entry for ",student._id);
            await newPayment.save();
        }*/
        console.log('rows created');
    }
    catch(error){
        console.log(error);
    }
}
cron.schedule('20 17 8 * *', () => {
    console.log('Running scheduled task');
    createPayment();
});

const feesPayment=async(req,res,next)=>{
    console.log("in fees payment");

    const {studentId, amount,mode,paymentDate, monthNumber}=req.body;
    console.log(studentId, amount,mode,paymentDate,monthNumber);
    let existingUser;

        try{
                //Update payments array in Student table
                existingUser=await Student.findOne({_id:studentId});
                if (!existingUser) {
                     const error = new Error("Student not found.");
                     return next(error);
                 }
                // Find the payment entry for the specified month
               const paymentEntry = existingUser.payments.find(p => p.month === monthNumber);
               if (!paymentEntry) {
                    console.log("no month entry");
                   const error = new Error("Unable to process Fees, try later!");
                   return next(error);
               }

               // Calculate the updated amounts
                const remainingDue = paymentEntry.amount_due - amount;
                const amountDue =  Math.max(0, remainingDue); // Set amount_due to 0 if paid in full
                paymentEntry.amount_paid = (Number(paymentEntry.amount_paid) || 0) + Number(amount);
                paymentEntry.amount_due = amountDue;
                if(amountDue===0)
                    paymentEntry.status='paid';
                else
                    paymentEntry.status='pending';

                existingUser.markModified("payments");

                await existingUser.save();

                //Entry in Payment Table
                let paymentStatus;
                if(amountDue===0)
                    paymentStatus="paid";
                else
                    paymentStatus="pending";

                const newPayment = new Payment({
                                student_id: studentId,
                                amount_due: amountDue,
                                amount_paid:amount,
                                payment_mode:mode,
                                date_of_payment:paymentDate,
                                payment_status:paymentStatus
                            });
                            console.log("Payment entry for ",studentId);
                            await newPayment.save();
                res.json({success:true});

            }catch(err){
                const error= new Error("Payment update failed..");
                console.log(err);
                return next(error);
            }
    }

    exports.feesPayment=feesPayment;