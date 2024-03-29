// models/subtask.js
const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  status: { type: Number, enum: [0, 1], default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  deleted_at: Date,
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
