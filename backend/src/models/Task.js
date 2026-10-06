const mongoose = require('mongoose');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Task title must be at least 3 characters long'],
      maxlength: [150, 'Task title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null
    },
    priority: {
      type: String,
      enum: {
        values: VALID_PRIORITIES,
        message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      },
      default: 'Pending'
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes for fast lookup
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);

Task.VALID_STATUSES = VALID_STATUSES;
Task.VALID_PRIORITIES = VALID_PRIORITIES;

module.exports = Task;
module.exports.Task = Task;
module.exports.VALID_STATUSES = VALID_STATUSES;
module.exports.VALID_PRIORITIES = VALID_PRIORITIES;
