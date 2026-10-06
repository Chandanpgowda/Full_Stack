const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// Routes for /api/employees
router
  .route('/')
  .get(getEmployees)
  .post(createEmployee);

// Routes for /api/employees/:id
router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
