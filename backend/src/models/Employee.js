const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [50, 'Department cannot exceed 50 characters']
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [50, 'Designation cannot exceed 50 characters']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Add index on department and name for optimized search and filter queries
employeeSchema.index({ name: 'text', email: 'text' });
employeeSchema.index({ department: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
