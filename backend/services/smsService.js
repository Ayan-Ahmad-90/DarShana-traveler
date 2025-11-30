const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMS = async (to, body) => {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.log('Twilio not configured, skipping SMS:', body);
    return;
  }
  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log('SMS sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // Don't throw, just log
  }
};
