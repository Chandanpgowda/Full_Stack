const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Task = require('./models/Task');

dotenv.config();

const sampleEmployees = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@company.com',
    department: 'Engineering',
    designation: 'Staff Software Architect'
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@company.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    department: 'Product',
    designation: 'Director of Product Management'
  },
  {
    name: 'David Chen',
    email: 'david.chen@company.com',
    department: 'Design',
    designation: 'Principal UI/UX Designer'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    department: 'Human Resources',
    designation: 'VP of People Operations'
  },
  {
    name: 'James Thornton',
    email: 'james.thornton@company.com',
    department: 'Marketing',
    designation: 'Growth Marketing Director'
  },
  {
    name: 'Amara Okafor',
    email: 'amara.okafor@company.com',
    department: 'Sales',
    designation: 'Enterprise Account Executive'
  },
  {
    name: 'Lucas Silva',
    email: 'lucas.silva@company.com',
    department: 'Finance',
    designation: 'Senior Financial Analyst'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management');
    console.log('[Seeder]: Connected to MongoDB');

    let employees = await Employee.find();
    if (employees.length === 0) {
      console.log('[Seeder]: Database is empty. Seeding initial employee records...');
      employees = await Employee.insertMany(sampleEmployees);
      console.log(`[Seeder]: Successfully seeded ${employees.length} employee records.`);
    } else {
      console.log(`[Seeder]: Found ${employees.length} employee records.`);
    }

    const taskCount = await Task.countDocuments();
    if (taskCount === 0 && employees.length > 0) {
      console.log('[Seeder]: Seeding initial sample tasks...');
      const sampleTasks = [
        {
          title: 'Conduct Q3 Cloud Infrastructure Security Audit',
          description: 'Review IAM access keys, VPC security group boundaries, and rotate TLS certificates.',
          assignedTo: employees[0]._id,
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Design Component Library System in Figma',
          description: 'Create standardized design tokens for buttons, inputs, modals, and data visualization cards.',
          assignedTo: employees[3] ? employees[3]._id : employees[0]._id,
          priority: 'Urgent',
          status: 'Pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Prepare Annual Benefits & Compensation Review',
          description: 'Compile salary benchmarking data across engineering and product departments.',
          assignedTo: employees[4] ? employees[4]._id : employees[0]._id,
          priority: 'Medium',
          status: 'Completed',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ];

      await Task.insertMany(sampleTasks);
      console.log(`[Seeder]: Successfully seeded ${sampleTasks.length} workplace tasks.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDB();
