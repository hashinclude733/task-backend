const twilio = require('twilio');

const makeVoiceCall = async () => {
  try {
    const accountSid = 'AC25730c79a37433d3a104fb86b47e8c56'; // Replace with your Twilio Account SID
    const authToken = '5065e2d579618435d896842d5a3dfc23'; // Replace with your Twilio Auth Token
    const twilioPhoneNumber = '+15714140623'; // Replace with your Twilio Phone Number
    const userPhoneNumber = '+91 8869046877'; // Replace with the phone number you want to call

    const twilioClient = twilio(accountSid, authToken);

    const call = await twilioClient.calls.create({
      to: userPhoneNumber,
      from: twilioPhoneNumber,
      url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your actual TwiML URL
      method: 'GET',
    });

    console.log('Voice call initiated successfully. Call SID:', call.sid);
  } catch (error) {
    console.error('Error in making voice call:', error.message);
  }
};
makeVoiceCall();

// Uncomment the line below to make the voice call
// makeVoiceCall();
