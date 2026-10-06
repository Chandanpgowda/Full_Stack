const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

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

    const count = await Employee.countDocuments();
    if (count === 0) {
      console.log('[Seeder]: Database is empty. Seeding initial employee records...');
      await Employee.insertMany(sampleEmployees);
      console.log(`[Seeder]: Successfully seeded ${sampleEmployees.length} employee records.`);
    } else {
      console.log(`[Seeder]: Database already contains ${count} employee records. Skipping initial seeding.`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDB();
