/**
 * Validate employee form data
 * @param {Object} data - { name, email, department, designation }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateEmployeeForm = ({ name, email, department, designation }) => {
  const errors = {};

  // Name validation
  if (!name || !name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. user@company.com)';
  }

  // Department validation
  if (!department || !department.trim()) {
    errors.department = 'Department is required';
  }

  // Designation validation
  if (!designation || !designation.trim()) {
    errors.designation = 'Designation/Job title is required';
  } else if (designation.trim().length > 50) {
    errors.designation = 'Designation cannot exceed 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
