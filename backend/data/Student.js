const cron = require('node-cron');
const Student = require("../models/Student");


const getStudents=async(req,res,next)=>{
    let students;
    try{
        students=await Student.find().sort({name:1});
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
         students=await Student.find({branch_id:req.params.id}).sort({name:1});;
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

        const currentMonth = new Date().getMonth() + 1;

        // Generate payments array for the student
        const payments = [];
        for (let i = 1; i <= 12; i++) {
            payments.push({
                month: i,
                amount_paid: 0, // Mark full payment for past months
                amount_due: i < currentMonth ? 0 : monthly_fees,  // No due for past months
                status: i < currentMonth ? 'na':'pending',
            });
        }
    const createdUser=new Student({name, email, phone, address, branch_id, monthly_fees, active:true, payments});

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
    if(email){
        let existingUser;
        try{
            existingUser = await Student.findOne({ email });
        }catch(err){
            const error= new Error("Updation failed");
            console.log(err);
            return next(error);
        }
        if(existingUser && existingUser._id.toString() !== id){
            const error= new Error("email id is already in use, could not update Student details");
            console.log(error);
            return next(error);
        }
    }

  console.log("From update ",id, name, email, phone,address, monthly_fees);
        const currentMonth = new Date().getMonth() + 1;

        // Generate payments array for the student
       /* const payments = [];
        for (let i = 1; i <= 12; i++) {
            payments.push({
                month: i,
                amount_paid: 0, // Mark full payment for past months
                //amount_due: i < currentMonth ? 0 : monthly_fees  // No due for past months
                amount_due: 3000  // No due for past months
            });
        }*/
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
            const student=await Student.findOne({_id:id});
            if (!student) {
                 const error = new Error("Student not found.");
                 return next(error);
            }
            // Find the payment entry for the current month
           const currentMonthNumber = new Date().getMonth() + 1;
           const newPayments = student.payments.filter(p => p.month >= currentMonthNumber);

           if (newPayments.length===0) {
               const error = new Error("Payment entry for the specified month not found.");
               return next(error);
           }

           if(active===false){
              newPayments.forEach(entry=>{
                entry.amount_due = 0; // Set amount_due to 0
                entry.status="waived";
              });
            }
            else{
              newPayments.forEach(entry=>{
                const remainingAmount = Number(student.monthly_fees) - Number(entry.amount_paid);

                entry.amount_due = remainingAmount;
                if(remainingAmount===0)
                    entry.status="paid";
                else
                    entry.status="pending";
                });
            }

           student.markModified('payments'); // Mark payments array as modified
           student.active=active;
           await student.save();
           res.status(200).json({success:true, message:'status updated', student:student});
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
           if(Math.max(0, remainingDue))
                paymentEntry.status="paid";
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
           paymentEntry.status="waived";
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

    const sendReminders= async(req,res,next)=>{
        const { sendEmailNotification } = require('../services/emailService'); // Your email service
        const { sendSMSNotification, sendWhatsAppMessage } = require('../services/smsService');     // Your SMS service

        console.log("in Student send Reminders");

        const {studentId}=req.params;
        const {notificationMsg}=req.body;
        console.log(studentId, notificationMsg);
        let student;
        try{
            student=await Student.findOne({_id:studentId});
            if (!student) {
                 const error = new Error("Student not found.");
                 return next(error);
            }
            if(!student.reminder_enabled){
                const error = new Error("Sending reminders not enabled");
                return next(error);
            }
            const {name, email, phone} = student;
            //await sendEmailNotification(email, subject, reminderMsg);
            await sendSMSNotification(phone, notificationMsg);
            res.json({success:true,message:'Notification sent'});
        }
        catch(err){
            console.log(err);
            const error= new Error("Failed to send reminders. Please try again later.");
            return next(error);
        }
    }

    const sendPaymentReminders= async()=>{          //function to send monthly reminder if payment is not made till the 7th of each month
        const { sendEmailNotification } = require('../services/emailService'); // Your email service
        const { sendSMSNotification, sendWhatsAppMessage } = require('../services/smsService');     // Your SMS service
        const monthNames = [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                       ];


        // Schedule the job to run every minute (for testing purposes)
        console.log('Running cron job to send notifications...');

        const currentMonthNumber = new Date().getMonth() + 1;
        const startMonth = ((currentMonth - 5 + 12) % 12) || 12;

        try
        {
            const students = await Student.find();
            for (const student of students) {
                const {_id, name, email, phone, payments, active} = student;
                //if(!active) continue;
                console.log("student:",_id);
                const totalAmountDue = payments.reduce((sum, item) => {
                    // Only add `amount_due` if the month is <= currentMonthNumber
                    if((item.month >= startMonth && item.month <= currentMonth) ||
                    (startMonth > currentMonth && (item.month >= startMonth || item.month <= currentMonth))
                    && item.amount_due>0)
                        return sum + item.amount_due;

                    return sum;
                }, 0);

                const currentMonthName = monthNames[new Date().getMonth()];
                const currentMonthPayment = payments.find(payment => payment.month === currentMonthNumber);
                let subject;
                if(currentMonthPayment.status==="pending"){
                    console.log(`Dear ${name}, your payment of Rs ${totalAmountDue}.00 for the month of ${currentMonthName} is due. Please pay on time to avoid late fee`);
                    subject=`Payment Reminder`;
                    const reminderMsg=`Dear ${name}, your payment of Rs ${totalAmountDue} for the month of ${currentMonthName} is due. Please pay on time to avoid late fee`;
                    await sendEmailNotification(email, subject, reminderMsg);
                    await sendSMSNotification(phone, reminderMsg);
                    await sendWhatsAppMessage(phone, reminderMsg);
                }
                else{
                    if(currentMonthPayment.status==="paid"){
                        console.log(`Thank You for your payment of fees Rs ${payments[currentMonthNumber-1].amount_paid}.00 for the month of ${currentMonthName}.`);
                        subject=`Confirmation of fees paid`;
                        const confirmationMsg=`Thank You for your payment of fees Rs ${payments[currentMonthNumber-1].amount_paid}.00 for the month of ${currentMonthName}.`;
                        await sendEmailNotification(email, subject, confirmationMsg);
                        await sendSMSNotification(phone, confirmationMsg);
                        await sendWhatsAppMessage(phone, confirmationMsg);
                        currentMonthPayment.status = "confirmation_sent"; // Update status to 'Paid' for the current month
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
    cron.schedule('55 13 * * THU', () => {
        console.log('Running scheduled weekly task-reminders');
        sendPaymentReminders();
    });


    const getDefaulters=async(req,res,next)=>{
        try{
            console.log("defaulter list");
            const currentMonth = new Date().getMonth() + 1;
            const startMonth = ((currentMonth - 5 + 12) % 12) || 12;
            console.log(currentMonth,startMonth);

            const students = await Student.find().sort({name:1});
            const defaulters = students.map(student => {
                const {_id, name, active, branch_id, payments} = student;

                const payment_details = payments
                    .filter(item => (
                                        ((item.month >= startMonth && item.month <= currentMonth) ||
                                        (startMonth > currentMonth && (item.month >= startMonth || item.month <= currentMonth))
                                        ) && item.amount_due>0 && item.status==='pending'))
                    .map(item => ({
                        month: item.month,
                        amount_due: item.amount_due,
                    }));
    console.log("payment entries", student.name, payment_details);
                    const totalAmountDue = payments.reduce((sum, item) => {
                        if (
                            ((item.month >= startMonth && item.month <= currentMonth) ||
                            (startMonth > currentMonth && (item.month >= startMonth || item.month <= currentMonth)))
                        ) {
                            return sum + item.amount_due;
                        }
                        return sum;
                    }, 0);

                if(totalAmountDue>0){
                    return{_id,
                          active,
                          name,
                          branch_id,
                          payment_details, // Only send name and payment details
                      };
                }
                return null;
            }).filter(item => item !== null); // Remove null entries
            console.log("defaulters:", defaulters);
            res.status(200).json({students:defaulters});
         }
         catch(err){
            console.log(err);
         }
    };

    const resetPayments=async(req,res,next)=>{
    console.log("running scheduler");
    try
        {
            const currentMonthNumber = new Date().getMonth() + 1;
            let startMonth, endMonth;

            if (currentMonthNumber === 6) { // If current month is June
              startMonth = 7; // Start from July
              endMonth = 12;  // End at December
            } else if (currentMonthNumber === 12) { // If current month is December
              startMonth = 1;  // Start from January
              endMonth = 6;    // End at June
            } else {
             console.log("Not the month for payment reset");
            }

            const students = await Student.find();
            for (const student of students) {
                const updatedpayments = student.payments.map(payment=>{
                if (payment.month >= startMonth && payment.month <= endMonth) {
                    return{
                        ...payment,
                        amount_paid:0,
                        amount_due:student.monthly_fees,
                        status:"pending"
                    };
                }
                    return payment;
                });
                student.payments=updatedpayments;
                student.markModified("payments");
                await student.save();
            }
            console.log("reset payment array");
        }
        catch(error){
            console.log("Failed to reset payment array");
        }
    }

    cron.schedule('18 13 14 6,12 *', () => {
        console.log('Running reset payments arrays on the 1st of june and dec');
        resetPayments();
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
    exports.sendReminders=sendReminders;
    exports.getDefaulters=getDefaulters;

