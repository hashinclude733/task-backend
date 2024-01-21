// voiceCallService.js
require('dotenv').config(); 
const User = require('../models/user-model');
const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
console.log(TWILIO_ACCOUNT_SID);
const makeVoiceCall = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error('User not found.');
      return;
    }

    if (user.priority === 0) {
      // Extract user phone number and make the voice call using Twilio or any other service
      const userPhoneNumber = user.phone_number;
      const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

      // Replace the following with your actual Twilio logic to make a voice call
      twilioClient.calls.create({
        to: userPhoneNumber,
        from: TWILIO_PHONE_NUMBER,
        url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your actual TwiML URL
        method: 'GET',
      });

      console.log('Voice call initiated for user with priority 0.');
    } else {
      console.log('User priority is not 0. No voice call initiated.');
    }
  } catch (error) {
    console.error('Error in making voice call:', error.message);
  }
};

module.exports = { makeVoiceCall };
