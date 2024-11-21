const Payment=require("../models/Payment");
const Student=require("../models/Student");

const cron = require('node-cron');

const createPayment = async () => {
    try {
        const currentDate = new Date();
        const students = await Student.find();

        for (const student of students) {
            const newPayment = new Payment({
                student_id: student._id,
                amount_due: student.monthly_fees
            });
            console.log("entry for ",student._id);
            await newPayment.save();
        }
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
        existingUser=await Payment.findOne({student_id:studentId});
        existingUser.date_of_payment=paymentDate;
        existingUser.amount_paid=amount;
        existingUser.payment_mode=mode;
        await existingUser.save();
        //res.json({success:true, student:existingUser});

    }catch(err){
        const error= new Error("Payment failed..User not registered");
        console.log(err);
        return next(error);
    }

    console.log("in Student fees payment");


            //let existingUser;
            try{
                existingUser=await Student.findOne({_id:studentId});
                if (!existingUser) {
                     const error = new Error("Student not found.");
                     return next(error);
                 }
                // Find the payment entry for the specified month
               const paymentEntry = existingUser.payments.find(p => p.month === monthNumber);
console.log("found month entry");
               if (!paymentEntry) {
                    console.log("no month entry");
                   const error = new Error("Payment entry for the specified month not found.");
                   return next(error);
               }

               // Calculate the updated amounts
                const remainingDue = paymentEntry.amount_due - amount;
                paymentEntry.amount_paid = (Number(paymentEntry.amount_paid) || 0) + Number(amount);
                paymentEntry.amount_due = Math.max(0, remainingDue); // Set amount_due to 0 if paid in full

                existingUser.markModified("payments");

                await existingUser.save();
                res.json({success:true});

            }catch(err){
                const error= new Error("Payment update failed..");
                console.log(err);
                return next(error);
            }
}

    exports.feesPayment=feesPayment;