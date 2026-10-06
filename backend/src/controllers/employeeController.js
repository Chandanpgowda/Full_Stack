const mongoose = require('mongoose');
const Employee = require('../models/Employee');

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Public
 */
const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, designation } = req.body;

    // Explicit check for missing fields for immediate user feedback
    const missingFields = [];
    if (!name || !name.trim()) missingFields.push('name');
    if (!email || !email.trim()) missingFields.push('email');
    if (!department || !department.trim()) missingFields.push('department');
    if (!designation || !designation.trim()) missingFields.push('designation');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(', ')}`,
        errors: missingFields.map(f => `${f} is required`)
      });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: `Employee with email '${email.trim().toLowerCase()}' already exists`
      });
    }

    const newEmployee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      designation: designation.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees with search, department filter, and pagination
 * @route   GET /api/employees
 * @access  Public
 */
const getEmployees = async (req, res, next) => {
  try {
    const { search, department, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build query filter
    const query = {};

    // Search by name or email (case-insensitive)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    // Filter by department (case-insensitive)
    if (department && department.trim()) {
      const deptRegex = new RegExp(`^${department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      query.department = deptRegex;
    }

    // Pagination logic
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) === 0 ? 0 : Math.max(1, parseInt(limit, 10) || 10);
    const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;

    // Sorting logic
    const sortDirection = order.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    // Execute queries in parallel for optimal performance
    const [totalEmployees, employees] = await Promise.all([
      Employee.countDocuments(query),
      limitNum > 0
        ? Employee.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean()
        : Employee.find(query).sort(sortOptions).lean()
    ]);

    const totalPages = limitNum > 0 ? Math.ceil(totalEmployees / limitNum) : 1;

    return res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        total: totalEmployees,
        page: limitNum > 0 ? pageNum : 1,
        limit: limitNum > 0 ? limitNum : totalEmployees,
        totalPages: totalPages || 1,
        hasNextPage: limitNum > 0 && pageNum < totalPages,
        hasPrevPage: limitNum > 0 && pageNum > 1
      },
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single employee by ID
 * @route   GET /api/employees/:id
 * @access  Public
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'`
      });
    }

    const employee = await Employee.findById(id).lean();

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Public
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, department, designation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'`
      });
    }

    // Verify employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID '${id}'`
      });
    }

    // Check if new email conflicts with another employee
    if (email && email.trim().toLowerCase() !== employee.email) {
      const emailConflict = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: id }
      });

      if (emailConflict) {
        return res.status(409).json({
          success: false,
          message: `Email '${email.trim().toLowerCase()}' is already in use by another employee`
        });
      }
    }

    // Apply updates
    if (name !== undefined) employee.name = name.trim();
    if (email !== undefined) employee.email = email.trim().toLowerCase();
    if (department !== undefined) employee.department = department.trim();
    if (designation !== undefined) employee.designation = designation.trim();

    const updatedEmployee = await employee.save();

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee by ID
 * @route   DELETE /api/employees/:id
 * @access  Public
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'`
      });
    }

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {
        id: employee._id,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
