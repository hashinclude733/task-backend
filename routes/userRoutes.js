const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const SECRET = 'SECr3t'; 
const { authenticateToken } = require('../middlewares/auth'); // Import the middleware

// Apply the authentication middleware to protect the routes


// Create User
router.post('/signup', async (req, res) => {
  const { phone_number, priority } = req.body;

  const user = new User({
    phone_number,
    priority,
  });

  try {
    await user.save();
    const token = jwt.sign({ userId: user._id }, SECRET , { expiresIn: '1h' });
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { phone_number } = req.body;

  try {
    const user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number.' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET , { expiresIn: '1h' });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


const makeVoiceCall = async (userPhoneNumber) => {
  try {
    const cleanedPhoneNumber = userPhoneNumber.toString().replace(/^\+1/, '');

    const number="+91"+cleanedPhoneNumber;
    const accountSid = 'AC25730c79a37433d3a104fb86b47e8c56'; // Replace with your Twilio Account SID
    const authToken = '5065e2d579618435d896842d5a3dfc23'; // Replace with your Twilio Auth Token
    const twilioPhoneNumber = '+15714140623'; // Replace with your Twilio Phone Number

    const twilioClient = twilio(accountSid, authToken);

    const call = await twilioClient.calls.create({
      to: number,
      from: twilioPhoneNumber,
      url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your actual TwiML URL
      method: 'GET',
    });

    console.log('Voice call initiated successfully. Call SID:', call.sid);
  } catch (error) {
    console.error('Error in making voice call:', error.message);
  }
};



// Get Current User
router.get('/me',authenticateToken, async (req, res) => {
  try {
  
    console.log("Decoded user:", req.user);

    const user = await User.findById(req.user.userId);
    console.log("Found user:", user);
   
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.priority === 0) {
      // Call the function to make a voice call if the user's priority is 0
      await makeVoiceCall(user.phone_number);
      console.log('Voice call initiated for user with priority 0.');
    } else {
      console.log('User priority is not 0. No voice call initiated.');
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
