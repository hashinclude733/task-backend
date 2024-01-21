// routes/subtasks.js
const express = require('express');
const router = express.Router();
const SubTask = require('../models/subtask-model');
const { authenticateToken } = require('../middlewares/auth'); // Import the middleware

// Apply the authentication middleware to protect the routes
router.use(authenticateToken);

// Create SubTask
router.post('/', async (req, res) => {
  const subTask = new SubTask({
    task_id: req.body.task_id,
  });

  try {
    await subTask.save();
    return res.status(201).json({ subTask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update SubTask
router.put('/:subTaskId', async (req, res) => {
  try {
    const subTask = await SubTask.findByIdAndUpdate(req.params.subTaskId, {
      status: req.body.status,
      updated_at: Date.now(),
    }, { new: true });

    if (!subTask) {
      return res.status(404).json({ error: 'SubTask not found' });
    }

    return res.json({ subTask });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Soft Delete SubTask
router.delete('/:subTaskId', async (req, res) => {
  try {
    const subTask = await SubTask.findByIdAndUpdate(req.params.subTaskId, { deleted_at: Date.now() }, { new: true });

    if (!subTask) {
      return res.status(404).json({ error: 'SubTask not found' });
    }

    return res.json({ message: 'SubTask deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// routes/subtasks.js
// ... (previous code)

// Get User SubTasks
router.get('/', async (req, res) => {
    const task_id = req.query.task_id;
  console.log(task_id);
    try {
      const subTasks = await SubTask.find({ task_id, deleted_at: { $exists: false } })
        .sort({ created_at: 1 })
        .exec();
  
      return res.json({ subTasks });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  
  

module.exports = router;
