// taskPriorityUpdater.js
const Task = require('../models/task-model');
const User = require('../models/user-model');
const { makeVoiceCall } = require('./voiceCallScheduler'); // Import the makeVoiceCall function

async function updateTaskPriorities() {
  try {
    // Update task priorities based on due_date
    const today = new Date();

    // Set priority 0 for tasks due today
    await Task.updateMany(
      { due_date: { $gte: today, $lt: today + 1 }, priority: { $ne: 0 } },
      { priority: 0 }
    );

    // Set priority 1 for tasks due tomorrow and the day after tomorrow
    await Task.updateMany(
      { due_date: { $gte: today + 1, $lt: today + 3 }, priority: { $nin: [0, 1] } },
      { priority: 1 }
    );

    // Set priority 2 for tasks due in 3 to 4 days
    await Task.updateMany(
      { due_date: { $gte: today + 3, $lt: today + 5 }, priority: { $nin: [0, 1, 2] } },
      { priority: 2 }
    );

    // Set priority 3 for tasks due in 5 or more days
    await Task.updateMany(
      { due_date: { $gte: today + 5 }, priority: { $nin: [0, 1, 2, 3] } },
      { priority: 3 }
    );

    // Update user priorities based on the highest priority of their tasks
    const users = await User.find();

    for (const user of users) {
      const highestTaskPriority = await Task
        .findOne({ user: user._id })
        .sort({ priority: -1 })
        .select('priority');

      if (highestTaskPriority) {
        user.priority = highestTaskPriority.priority;
        await user.save();

        // Call makeVoiceCall function if user priority is 0
        if (user.priority === 0) {
          await makeVoiceCall(user._id);
        }
      }
    }

    console.log('Task and user priorities updated successfully.');
  } catch (err) {
    console.error('Error in changing task and user priority:', err.message);
  }
}

module.exports = { updateTaskPriorities };


