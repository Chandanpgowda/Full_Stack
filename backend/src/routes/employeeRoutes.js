const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { getEmployeeTasks } = require('../controllers/taskController');

// Routes for /api/employees
router
  .route('/')
  .get(getEmployees)
  .post(createEmployee);

// Get all tasks for an employee
router.get('/:id/tasks', getEmployeeTasks);

// Routes for /api/employees/:id
router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
