// db.js
const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/TaskBackend'; // Replace with your MongoDB connection URL

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   
    });
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectToDatabase;
