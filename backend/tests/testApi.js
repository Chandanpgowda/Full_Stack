/**
 * Automated End-to-End API Test Suite for Employee Management System Backend
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('../src/app');
const Employee = require('../src/models/Employee');

const PORT = 5001; // Use test port
const BASE_URL = `http://localhost:${PORT}/api`;

let server;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('  RUNNING BACKEND REST API VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // 1. Connect DB and clean test records
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management');
    console.log('Connected to MongoDB for testing...');
    await Employee.deleteMany({ email: /@test-example\.com$/i });

    // 2. Start test server
    server = app.listen(PORT);
    console.log(`Test server running at http://localhost:${PORT}\n`);

    // TEST 1: Health Check Endpoint
    console.log('[1] Health Check Endpoint (GET /api/health)');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, `Health check returns 200 (Got: ${healthRes.status})`);
    assert(healthData.success === true && healthData.status === 'healthy', 'Health check reports healthy');
    assert(healthData.database.status === 'connected', 'Database connection reported as connected');

    // TEST 2: Input Validation - Missing Fields (POST /api/employees)
    console.log('\n[2] Validation - Missing Required Fields (POST /api/employees)');
    const missingFieldsRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete User' }) // Missing email, department, designation
    });
    const missingFieldsData = await missingFieldsRes.json();
    assert(missingFieldsRes.status === 400, `Returns 400 Bad Request on missing fields (Got: ${missingFieldsRes.status})`);
    assert(missingFieldsData.success === false, 'Returns success: false');
    assert(Array.isArray(missingFieldsData.errors) && missingFieldsData.errors.length > 0, 'Returns descriptive errors array');

    // TEST 3: Input Validation - Invalid Email Format (POST /api/employees)
    console.log('\n[3] Validation - Invalid Email Format (POST /api/employees)');
    const invalidEmailRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: 'invalid-email-address',
        department: 'Engineering',
        designation: 'QA Engineer'
      })
    });
    const invalidEmailData = await invalidEmailRes.json();
    assert(invalidEmailRes.status === 400, `Returns 400 Bad Request on invalid email format (Got: ${invalidEmailRes.status})`);
    assert(invalidEmailData.success === false, 'Returns success: false on invalid email');

    // TEST 4: Create Employee (POST /api/employees)
    console.log('\n[4] Create Employee - Success (POST /api/employees)');
    const createRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Johnson',
        email: 'alice.johnson@test-example.com',
        department: 'Engineering',
        designation: 'Senior Full Stack Developer'
      })
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, `Returns 201 Created (Got: ${createRes.status})`);
    assert(createData.success === true, 'Returns success: true');
    assert(createData.data._id && createData.data.name === 'Alice Johnson', 'Returns created employee object with _id');
    const createdId = createData.data._id;

    // TEST 5: Duplicate Email Handling (POST /api/employees)
    console.log('\n[5] Duplicate Email Rejection (POST /api/employees)');
    const dupRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Clone',
        email: 'alice.johnson@test-example.com',
        department: 'HR',
        designation: 'Recruiter'
      })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 409, `Returns 409 Conflict on duplicate email (Got: ${dupRes.status})`);
    assert(dupData.success === false, 'Returns success: false');

    // Seed 2 more employees for search and filter testing
    const seed1 = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bob Smith',
        email: 'bob.smith@test-example.com',
        department: 'Human Resources',
        designation: 'HR Manager'
      })
    });
    const seed1Data = await seed1.json();

    const seed2 = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Charlie Davis',
        email: 'charlie.davis@test-example.com',
        department: 'Marketing',
        designation: 'Product Marketing Lead'
      })
    });
    const seed2Data = await seed2.json();

    // TEST 6: List All Employees (GET /api/employees)
    console.log('\n[6] List Employees with Pagination (GET /api/employees)');
    const listRes = await fetch(`${BASE_URL}/employees`);
    const listData = await listRes.json();
    assert(listRes.status === 200, `Returns 200 OK (Got: ${listRes.status})`);
    assert(listData.success === true, 'Returns success: true');
    assert(Array.isArray(listData.data) && listData.data.length >= 3, `Returns array of employees (Count: ${listData.data.length})`);
    assert(listData.pagination && typeof listData.pagination.total === 'number', 'Includes pagination metadata');

    // TEST 7: Search by Name (GET /api/employees?search=alice)
    console.log('\n[7] Search Employees by Name (GET /api/employees?search=alice)');
    const searchNameRes = await fetch(`${BASE_URL}/employees?search=alice`);
    const searchNameData = await searchNameRes.json();
    assert(searchNameRes.status === 200, 'Returns 200 OK');
    assert(searchNameData.data.some(e => e.name.toLowerCase().includes('alice')), 'Finds matching employee by name');

    // TEST 8: Search by Email (GET /api/employees?search=bob.smith)
    console.log('\n[8] Search Employees by Email (GET /api/employees?search=bob.smith)');
    const searchEmailRes = await fetch(`${BASE_URL}/employees?search=bob.smith`);
    const searchEmailData = await searchEmailRes.json();
    assert(searchEmailRes.status === 200, 'Returns 200 OK');
    assert(searchEmailData.data.some(e => e.email === 'bob.smith@test-example.com'), 'Finds matching employee by email');

    // TEST 9: Filter by Department (GET /api/employees?department=Human Resources)
    console.log('\n[9] Filter Employees by Department (GET /api/employees?department=Human Resources)');
    const filterDeptRes = await fetch(`${BASE_URL}/employees?department=${encodeURIComponent('Human Resources')}`);
    const filterDeptData = await filterDeptRes.json();
    assert(filterDeptRes.status === 200, 'Returns 200 OK');
    assert(
      filterDeptData.data.length > 0 && filterDeptData.data.every(e => e.department.toLowerCase() === 'human resources'),
      'Returns only employees belonging to the specified department'
    );

    // TEST 10: Get Employee By ID (GET /api/employees/:id)
    console.log(`\n[10] Get Employee By ID (GET /api/employees/${createdId})`);
    const getByIdRes = await fetch(`${BASE_URL}/employees/${createdId}`);
    const getByIdData = await getByIdRes.json();
    assert(getByIdRes.status === 200, `Returns 200 OK (Got: ${getByIdRes.status})`);
    assert(getByIdData.success === true && getByIdData.data._id === createdId, 'Retrieves correct employee details');

    // TEST 11: Get Employee By Invalid ID Format (GET /api/employees/invalid-id-123)
    console.log('\n[11] Get Employee by Invalid ID Format (GET /api/employees/invalid-id)');
    const invalidIdRes = await fetch(`${BASE_URL}/employees/invalid-id-123`);
    const invalidIdData = await invalidIdRes.json();
    assert(invalidIdRes.status === 400, `Returns 400 Bad Request for malformed ObjectId (Got: ${invalidIdRes.status})`);
    assert(invalidIdData.success === false, 'Returns success: false for invalid ObjectId');

    // TEST 12: Get Employee By Non-existent ID (GET /api/employees/507f1f77bcf86cd799439011)
    console.log('\n[12] Get Missing Employee (GET /api/employees/507f1f77bcf86cd799439011)');
    const nonExistentRes = await fetch(`${BASE_URL}/employees/507f1f77bcf86cd799439011`);
    const nonExistentData = await nonExistentRes.json();
    assert(nonExistentRes.status === 404, `Returns 404 Not Found (Got: ${nonExistentRes.status})`);
    assert(nonExistentData.success === false, 'Returns success: false for missing employee');

    // TEST 13: Update Employee (PUT /api/employees/:id)
    console.log(`\n[13] Update Employee (PUT /api/employees/${createdId})`);
    const updateRes = await fetch(`${BASE_URL}/employees/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designation: 'Principal Engineer',
        department: 'Core Architecture'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, `Returns 200 OK (Got: ${updateRes.status})`);
    assert(updateData.success === true, 'Returns success: true');
    assert(updateData.data.designation === 'Principal Engineer', 'Designation correctly updated');
    assert(updateData.data.department === 'Core Architecture', 'Department correctly updated');

    // TEST 14: Update Employee with Duplicate Email Conflict (PUT /api/employees/:id)
    console.log(`\n[14] Update Employee Duplicate Email Conflict (PUT /api/employees/${createdId})`);
    const updateDupRes = await fetch(`${BASE_URL}/employees/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bob.smith@test-example.com' // Already owned by seed1
      })
    });
    const updateDupData = await updateDupRes.json();
    assert(updateDupRes.status === 409, `Returns 409 Conflict when updating to existing email (Got: ${updateDupRes.status})`);
    assert(updateDupData.success === false, 'Returns success: false on email collision');

    // TEST 15: Delete Employee (DELETE /api/employees/:id)
    console.log(`\n[15] Delete Employee (DELETE /api/employees/${createdId})`);
    const deleteRes = await fetch(`${BASE_URL}/employees/${createdId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200, `Returns 200 OK on deletion (Got: ${deleteRes.status})`);
    assert(deleteData.success === true, 'Returns success: true on deletion');

    // TEST 16: Verify Deleted Employee is No Longer Accessible
    console.log(`\n[16] Verify Deleted Employee Returns 404 (GET /api/employees/${createdId})`);
    const checkDeletedRes = await fetch(`${BASE_URL}/employees/${createdId}`);
    assert(checkDeletedRes.status === 404, `Returns 404 Not Found after deletion (Got: ${checkDeletedRes.status})`);

    // Clean up remaining test records
    await Employee.deleteMany({ email: /@test-example\.com$/i });

  } catch (error) {
    console.error('Fatal test execution error:', error);
    failedCount++;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();
    console.log('\n====================================================');
    console.log(`TEST SUMMARY: Total: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
    console.log('====================================================\n');

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();
