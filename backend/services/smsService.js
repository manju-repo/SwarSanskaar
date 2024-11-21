const twilio = require('twilio');
console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Set up Twilio client (replace with your Twilio credentials)
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMSNotification = async (phone, message) => {
    try {
        // Find user's phone number by userId (if needed), or pass the phone number directly
        const userPhoneNumber = '+919987012878';  // Fetch phone number for userId from DB

        const smsResponse = await client.messages.create({
            body: message,                      // SMS content
            from: '+19093230165',           // Twilio WhatsApp sandbox number
            to: '+919987012878',             // Receiver's phone number
        });

        console.log(`SMS message sent to  ${phone}: ${smsResponse.sid}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

const sendWhatsAppMessage = async (to, message) => {
    try {
        const messageResponse = await client.messages.create({
            body: message,
            from: 'whatsapp:+14155238886', // Twilio Sandbox Number for WhatsApp
            to: 'whatsapp:+919987012878'            // Recipient's WhatsApp number
        });
        console.log('WhatsApp message sent:', messageResponse.sid);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};

module.exports = { sendSMSNotification, sendWhatsAppMessage };
