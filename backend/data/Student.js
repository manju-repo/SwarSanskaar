const cron = require('node-cron');
const Student = require("../models/Student");


const getStudents=async(req,res,next)=>{
    let students;
    try{
        students=await Student.find();
        if (!students) {
            throw new NotFoundError('Could not find any data.');
         }
        res.json({ students: students.map(student => student.toObject({ getters: true })) });
    }catch(error){
         console.log(error);
         return next(error);
    }
}

const getStudent=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch student");
        return next(error);
     }
    let student;
    try{
         student=await Student.findOne({_id:req.params.id});
         if (!student) {
             throw new NotFoundError('Could not fetch student');
          }
         res.json({ success:true,student: student.toObject({ getters: true }) });
    }catch(error){
         console.log(error);
         return next(error);
    }
}

const getBranchStudents=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch students");
        return next(error);
     }
    let students;
    try{
         students=await Student.find({branch_id:req.params.id});
         if (!students) {
             throw new NotFoundError('Could not fetch students');
          }
        res.json({ students: students.map(student => student.toObject({ getters: true })) });
    }catch(error){
         console.log(error);
         return next(error);
    }
}

const register=async(req,res,next)=>{
console.log("in register");

    const {name, email, phone, address, branch_id,monthly_fees}=req.body;
    console.log(name,email,phone,address, branch_id, monthly_fees);
    if(email){
        let existingUser;
        try{
        existingUser = await Student.findOne({ email: { $ne: null, $eq: email } });
        }catch(err){
            const error= new Error("Registration failed");
            console.log(err);
            return next(error);
        }
        if(existingUser){
            const error= new Error("User already exists");
            console.log(error);
            return next(error);
        }
    }

    const createdUser=new Student({name, email,phone, address, branch_id,monthly_fees,active:true});

    try{
        await createdUser.save();
        console.log("Student created");
        res.json({success:true, student:createdUser});

    }catch(err){
        console.log(err);
        res.json({success:false, student:null, message:"Registration failed, please try again later."});
    }
}

async function update(req,res,next){
const {name,email,phone,address,monthly_fees}=req.body;
const id=req.params.id;


  console.log("From update ",id, name, email, phone,address, monthly_fees);

   try{
        const updatedItem=await Student.findByIdAndUpdate(id,{name:name, phone:phone, address:address, email:email, monthly_fees:monthly_fees},
        { new: true });
        res.status(201).json({success:true, message:'item updated', student:updatedItem});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}

async function changeStatus(req,res,next){
const {active}=req.body;
const id=req.params.id;


  console.log("From changeStatus ",id, active);

   try{
        const updatedItem=await Student.findByIdAndUpdate(id,{active:active},
        { new: true });
        res.status(201).json({success:true, message:'status updated', student:updatedItem});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}

    const updateFees=async(req,res,next)=>{
        console.log("in Student fees payment");

        const {studentId, amount,mode,paymentDate,month}=req.body;
        console.log(studentId, amount,month);
        let student;
        try{
            student=await Student.findOne({_id:studentId});
            if (!student) {
                 const error = new Error("Student not found.");
                 return next(error);
             }
            // Find the payment entry for the specified month
           const paymentEntry = student.payments.find(p => p.month === month);

           if (!paymentEntry) {
               const error = new Error("Payment entry for the specified month not found.");
               return next(error);
           }

           // Calculate the updated amounts
           const remainingDue = paymentEntry.amount_due - amount;
           paymentEntry.amount_paid += amount;
           paymentEntry.amount_due = Math.max(0, remainingDue); // Set amount_due to 0 if paid in full
           student.markModified('payments'); // Mark payments array as modified

           await student.save();
           res.json({success:true, student});

        }catch(err){
            const error= new Error("Payment update failed..");
            console.log(err);
            return next(error);
        }
    }

    const waiveFees=async(req,res,next)=>{
        console.log("in Student waive fees");

        const {studentId, month}=req.body;
        console.log(studentId, month);
        let student;
        try{
            student=await Student.findOne({_id:studentId});
            if (!student) {
                 const error = new Error("Student not found.");
                 return next(error);
             }
            // Find the payment entry for the specified month
           const paymentEntry = student.payments.find(p => p.month === month);

           if (!paymentEntry) {
               const error = new Error("Payment entry for the specified month not found.");
               return next(error);
           }

           paymentEntry.amount_due = 0; // Set amount_due to 0
           student.markModified('payments'); // Mark payments array as modified

            await student.save();
            res.json({success:true, student});

        }catch(err){
            const error= new Error("Payment update failed..");
            console.log(err);
            return next(error);
        }
    }

    const toggleRemindersEnabled=async(req,res,next)=>{
        console.log("in Student toggleRemindersEnabled");

        const {studentId}=req.params;
        const {reminder_enabled}=req.body;
        console.log(studentId, reminder_enabled);
        let student;
        try{
            student=await Student.findByIdAndUpdate(studentId, {reminder_enabled:reminder_enabled},
            { new: true });
            res.status(201).json({success:true, message:'item updated', student:student});
        }
        catch(err){
            const error= new Error("reminder  update failed..");
            console.log(err);
            return next(error);
        }
    }

    const sendReminders= async()=>{
        const { sendEmailNotification } = require('../services/emailService'); // Your email service
        const { sendSMSNotification, sendWhatsAppMessage } = require('../services/smsService');     // Your SMS service
        const monthNames = [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                       ];


        // Schedule the job to run every minute (for testing purposes)
        console.log('Running cron job to send notifications...');

        const currentMonthNumber = new Date().getMonth() + 1;

        try
        {
            const students = await Student.find();
            for (const student of students) {
                const {_id, name, email, phone, payments} = student;
                console.log("student:",_id);
                const totalAmountDue = payments.reduce((sum, item) => {
                    // Only add `amount_due` if the month is <= currentMonthNumber
                    if (item.month <= currentMonthNumber) {
                        return sum + item.amount_due;
                    }
                    return sum;
                }, 0);

                const currentMonthName = monthNames[new Date().getMonth()];
                const currentMonthPayment = payments.find(payment => payment.month === currentMonthNumber);
                let subject;
                if(totalAmountDue>0){
                    console.log(`Dear ${name}, your payment of Rs ${totalAmountDue}.00 for the month of ${currentMonthName} is due. Please pay on time to avoid late fee`);
                    subject=`Payment Reminder`;
                    const reminderMsg=`Dear ${name}, your payment of Rs ${totalAmountDue} for the month of ${currentMonthName} is due. Please pay on time to avoid late fee`;
                    await sendEmailNotification(email, subject, reminderMsg);
                    await sendSMSNotification(phone, reminderMsg);
                    await sendWhatsAppMessage(phone, reminderMsg);
                }
                else{
                    if(currentMonthPayment.status!=="paid"){
                        console.log(`Thank You for your payment of fees Rs ${payments[currentMonthNumber-1].amount_paid}.00 for the month of ${currentMonthName}.`);
                        subject=`Confirmation of fees paid`;
                        const confirmationMsg=`Thank You for your payment of fees Rs ${payments[currentMonthNumber-1].amount_paid}.00 for the month of ${currentMonthName}.`;
                        await sendEmailNotification(email, subject, confirmationMsg);
                        await sendSMSNotification(phone, confirmationMsg);
                        await sendWhatsAppMessage(phone, confirmationMsg);
                        currentMonthPayment.status = "paid"; // Update status to 'Paid' for the current month
                        student.markModified("payments");

                        await student.save();
                    }
                }
            }
        }
        catch (error) {
            console.error('Error running cron job:', error);
        }
    }
    cron.schedule('48 18 * * MON', () => {
        console.log('Running scheduled weekly task-reminders');
        sendReminders();
    });

    exports.getStudents=getStudents;
    exports.getStudent=getStudent;
    exports.getBranchStudents=getBranchStudents;
    exports.update=update;
    exports.register=register;
    exports.changeStatus=changeStatus;
    exports.updateFees=updateFees;
    exports.waiveFees=waiveFees;
    exports.toggleRemindersEnabled=toggleRemindersEnabled;