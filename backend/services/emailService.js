const nodemailer = require('nodemailer');

// Set up the transporter (replace with your SMTP settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use any SMTP service (Gmail, Outlook, etc.)
    auth: {
        user: process.env.COMPANY_EMAIL,      // Your email address from environment variables
        pass: process.env.EMAIL_PASSWORD      // Your email password from environment variables
    },
     tls: {
            rejectUnauthorized: false  // This disables certificate validation
        }
});

const sendEmailNotification = async (email, subject, message) => {
    try {
        // Find user email by userId (if needed), or pass the email directly
        const userEmail = 'manjusha.gupte@gmail.com';  // Fetch email for userId from DB

        const mailOptions = {
            from: process.env.COMPANY_EMAIL,     // Sender address
            to: userEmail,                      // Receiver's email
            subject: `${subject}`,        // Email subject
            html: `<p>${message}</p>`
                  // <p><img style="height:300px;width:300px;" src="cid:unique@image"/></p>`,  // Inline image reference in the HTML
       };

        // Send the email
        await transporter.sendMail(mailOptions);
        //console.log(`Email sent to  ${email}: ${message}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmailNotification };
