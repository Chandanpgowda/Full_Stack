const mongoose = require('mongoose');
const Task = require('../models/Task');
const Employee = require('../models/Employee');

/**
 * Valid Status and Priority Values (Documented)
 * ─────────────────────────────────────────────
 * Valid Status values:
 *   - 'Pending'      : Task has been created and is waiting to be started
 *   - 'In Progress'  : Task is actively being worked on
 *   - 'Completed'    : Task has been finished and verified
 *
 * Valid Priority values:
 *   - 'Low'          : Low-impact or non-urgent item
 *   - 'Medium'       : Normal operational priority (default)
 *   - 'High'         : High-priority item requiring prompt attention
 *   - 'Urgent'       : Critical deliverable requiring immediate resolution
 */
const VALID_STATUSES = Task.VALID_STATUSES || ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = Task.VALID_PRIORITIES || ['Low', 'Medium', 'High', 'Urgent'];

/**
 * Helper to match enum values case-insensitively and return standardized casing
 */
const normalizeEnum = (value, validList) => {
  if (!value || typeof value !== 'string') return null;
  const match = validList.find((v) => v.toLowerCase() === value.trim().toLowerCase());
  return match || null;
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 * @body    { title, description, status, priority, dueDate, assignedTo }
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    // 1. Validate Title (Required, length 3-150)
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required and cannot be empty'
      });
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Task title must be at least 3 characters long'
      });
    }

    if (trimmedTitle.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 150 characters'
      });
    }

    // 2. Validate Description (Optional, max 500)
    let trimmedDesc = '';
    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Task description must be a string'
        });
      }
      trimmedDesc = description.trim();
      if (trimmedDesc.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Task description cannot exceed 500 characters'
        });
      }
    }

    // 3. Validate Status (Optional, default 'Pending')
    let resolvedStatus = 'Pending';
    if (status !== undefined && status !== null && String(status).trim() !== '') {
      const normalized = normalizeEnum(status, VALID_STATUSES);
      if (!normalized) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Valid status values are: ${VALID_STATUSES.join(', ')}`
        });
      }
      resolvedStatus = normalized;
    }

    // 4. Validate Priority (Optional, default 'Medium')
    let resolvedPriority = 'Medium';
    if (priority !== undefined && priority !== null && String(priority).trim() !== '') {
      const normalized = normalizeEnum(priority, VALID_PRIORITIES);
      if (!normalized) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Valid priority values are: ${VALID_PRIORITIES.join(', ')}`
        });
      }
      resolvedPriority = normalized;
    }

    // 5. Validate Due Date (Optional)
    let resolvedDueDate = null;
    if (dueDate !== undefined && dueDate !== null && String(dueDate).trim() !== '') {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: `Invalid due date format: '${dueDate}'. Please provide a valid ISO date.`
        });
      }
      resolvedDueDate = parsedDate;
    }

    // 6. Validate Assigned Employee (Optional)
    let resolvedAssignedTo = null;
    if (assignedTo !== undefined && assignedTo !== null && String(assignedTo).trim() !== '') {
      const assignedStr = String(assignedTo).trim();
      if (!mongoose.Types.ObjectId.isValid(assignedStr)) {
        return res.status(400).json({
          success: false,
          message: `Invalid employee ID format for assignedTo: '${assignedStr}'`
        });
      }

      const employee = await Employee.findById(assignedStr);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: `Assigned employee not found with ID '${assignedStr}'`
        });
      }
      resolvedAssignedTo = employee._id;
    }

    // 7. Create Task Record
    const task = await Task.create({
      title: trimmedTitle,
      description: trimmedDesc,
      assignedTo: resolvedAssignedTo,
      priority: resolvedPriority,
      status: resolvedStatus,
      dueDate: resolvedDueDate
    });

    const populatedTask = await Task.findById(task._id).populate(
      'assignedTo',
      'name email department designation'
    );

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
 * @desc    Get all tasks with search, status/priority filtering, and pagination
 * @route   GET /api/tasks
 * @access  Public
 * @query   search, title, status, priority, assignedTo, page, limit, sortBy, order
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      title,
      status,
      priority,
      assignedTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Search: matches title (and description if broad search)
    const searchTerm = (search || title || '').trim();
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (title && !search) {
        query.title = searchRegex;
      } else {
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    // Filtering by Status (case-insensitive exact match)
    if (status && status.trim()) {
      const normalized = normalizeEnum(status, VALID_STATUSES);
      if (normalized) {
        query.status = normalized;
      } else {
        query.status = new RegExp(`^${status.trim()}$`, 'i');
      }
    }

    // Filtering by Priority (case-insensitive exact match)
    if (priority && priority.trim()) {
      const normalized = normalizeEnum(priority, VALID_PRIORITIES);
      if (normalized) {
        query.priority = normalized;
      } else {
        query.priority = new RegExp(`^${priority.trim()}$`, 'i');
      }
    }

    // Filtering by Assigned Employee
    if (assignedTo && String(assignedTo).trim()) {
      const assignedStr = String(assignedTo).trim();
      if (mongoose.Types.ObjectId.isValid(assignedStr)) {
        query.assignedTo = assignedStr;
      }
    }

    // Pagination & Sorting
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) === 0 ? 0 : Math.max(1, parseInt(limit, 10) || 20);
    const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;
    const sortDirection = String(order).toLowerCase() === 'asc' ? 1 : -1;
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
 * @desc    Retrieve a task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`
      });
    }

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email department designation')
      .lean();

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
 * @desc    Update a task by ID
 * @route   PUT /api/tasks/:id
 * @access  Public
 * @body    { title, description, status, priority, dueDate, assignedTo }
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`
      });
    }

    // Check if task exists
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID '${id}'`
      });
    }

    const updateFields = {};

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        });
      }
      const trimmed = title.trim();
      if (trimmed.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Task title must be at least 3 characters long'
        });
      }
      if (trimmed.length > 150) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot exceed 150 characters'
        });
      }
      updateFields.title = trimmed;
    }

    // Validate description if provided
    if (description !== undefined) {
      if (description === null) {
        updateFields.description = '';
      } else if (typeof description !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Task description must be a string'
        });
      } else {
        const trimmed = description.trim();
        if (trimmed.length > 500) {
          return res.status(400).json({
            success: false,
            message: 'Task description cannot exceed 500 characters'
          });
        }
        updateFields.description = trimmed;
      }
    }

    // Validate status if provided
    if (status !== undefined) {
      const normalized = normalizeEnum(status, VALID_STATUSES);
      if (!normalized) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Valid status values are: ${VALID_STATUSES.join(', ')}`
        });
      }
      updateFields.status = normalized;
    }

    // Validate priority if provided
    if (priority !== undefined) {
      const normalized = normalizeEnum(priority, VALID_PRIORITIES);
      if (!normalized) {
        return res.status(400).json({
          success: false,
          message: `Invalid priority '${priority}'. Valid priority values are: ${VALID_PRIORITIES.join(', ')}`
        });
      }
      updateFields.priority = normalized;
    }

    // Validate dueDate if provided
    if (dueDate !== undefined) {
      if (dueDate === null || String(dueDate).trim() === '') {
        updateFields.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: `Invalid due date format: '${dueDate}'`
          });
        }
        updateFields.dueDate = parsedDate;
      }
    }

    // Validate assignedTo if provided
    if (assignedTo !== undefined) {
      if (assignedTo === null || String(assignedTo).trim() === '') {
        updateFields.assignedTo = null;
      } else {
        const assignedStr = String(assignedTo).trim();
        if (!mongoose.Types.ObjectId.isValid(assignedStr)) {
          return res.status(400).json({
            success: false,
            message: `Invalid assigned employee ID format: '${assignedStr}'`
          });
        }
        const employeeExists = await Employee.findById(assignedStr);
        if (!employeeExists) {
          return res.status(404).json({
            success: false,
            message: `Assigned employee not found with ID '${assignedStr}'`
          });
        }
        updateFields.assignedTo = employeeExists._id;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email department designation');

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task by ID
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID format
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
      data: {
        id: task._id,
        title: task.title
      }
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
  getEmployeeTasks,
  VALID_STATUSES,
  VALID_PRIORITIES
};
