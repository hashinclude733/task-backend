// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task-model');

const { authenticateToken } = require('../middlewares/auth'); // Import the middleware

// Apply the authentication middleware to protect the routes
router.use(authenticateToken);
// Create Task
router.post('/create',async (req, res) => {
    const userId = req.user.id; 

  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date,
    user: userId,
  });

  await task.save();
  res.status(200).json({msg:"sucess"})
});

// Update Task
router.put('/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, {
      due_date: req.body.due_date,
      status: req.body.status,
      updated_at: Date.now(),
    }, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json({ task });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Soft Delete Task
router.delete('/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, { deleted_at: Date.now() }, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// routes/tasks.js
// ... (previous code)

// Get User Tasks
router.get('/', async (req, res) => {
    const userId = req.user.id; 
  
    try {
      const tasks = await Task.find({ user: userId, deleted_at: { $exists: false } })
        .sort({ due_date: 1 })
        .exec();
  
      return res.json({ tasks });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  

  

module.exports = router;
