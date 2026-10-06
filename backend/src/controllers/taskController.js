const mongoose = require('mongoose');
const Task = require('../models/Task');
const Employee = require('../models/Employee');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please assign this task to an employee'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID format: '${assignedTo}'`
      });
    }

    // Verify employee exists
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Assigned employee not found with ID '${assignedTo}'`
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      assignedTo,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate ? new Date(dueDate) : null
    });

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email department designation');

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with filtering, search, and pagination
 * @route   GET /api/tasks
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      assignedTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    if (status && status.trim()) {
      query.status = status.trim();
    }

    if (priority && priority.trim()) {
      query.priority = priority.trim();
    }

    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = assignedTo;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) === 0 ? 0 : Math.max(1, parseInt(limit, 10) || 20);
    const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;
    const sortDirection = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    const [totalTasks, tasks] = await Promise.all([
      Task.countDocuments(query),
      limitNum > 0
        ? Task.find(query)
            .populate('assignedTo', 'name email department designation')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .lean()
        : Task.find(query)
            .populate('assignedTo', 'name email department designation')
            .sort(sortOptions)
            .lean()
    ]);

    const totalPages = limitNum > 0 ? Math.ceil(totalTasks / limitNum) : 1;

    return res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        total: totalTasks,
        page: limitNum > 0 ? pageNum : 1,
        limit: limitNum > 0 ? limitNum : totalTasks,
        totalPages: totalPages || 1,
        hasNextPage: limitNum > 0 && pageNum < totalPages,
        hasPrevPage: limitNum > 0 && pageNum > 1
      },
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`
      });
    }

    const task = await Task.findById(id).populate('assignedTo', 'name email department designation').lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task by ID
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`
      });
    }

    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: `Invalid assigned employee ID: '${assignedTo}'`
        });
      }
      const employeeExists = await Employee.findById(assignedTo);
      if (!employeeExists) {
        return res.status(404).json({
          success: false,
          message: `Assigned employee not found with ID '${assignedTo}'`
        });
      }
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;
    if (dueDate !== undefined) updateFields.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email department designation');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task by ID
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: task._id, title: task.title }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks for a specific employee
 * @route   GET /api/employees/:id/tasks
 * @access  Public
 */
const getEmployeeTasks = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid employee ID: '${id}'`
      });
    }

    const tasks = await Task.find({ assignedTo: id }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getEmployeeTasks
};
