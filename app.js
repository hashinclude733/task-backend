// app.js
const express = require('express');
const connectToDatabase = require('./db'); 
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const userRoutes = require('./routes/userRoutes');
const {updateTaskPriorities } = require('./CronServices/taskPriorityUpdater.js');
const {makeVoiceCall} = require('./CronServices/voiceCallScheduler.js');
const cron = require('node-cron');


const app = express();
const port = 3000;
connectToDatabase();

app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/subtasks', subTaskRoutes);
app.use('/users', userRoutes);


 updateTaskPriorities();
 makeVoiceCall();
 

  

cron.schedule('* * * * *', async () => {
  console.log("Running updateTaskPriorities...");
  try {
    await updateTaskPriorities();
    console.log('Task and user priorities updated successfully.');
  } catch (err) {
    console.error('Error in the cron job:', err.message);
  }
});

  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
