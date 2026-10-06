/**
 * Complete End-to-End Quality, Validation, Error Handling & Bonus Feature Test Suite
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('../src/app');
const Employee = require('../src/models/Employee');

const PORT = 5002;
const BASE_URL = `http://localhost:${PORT}/api`;

let server;
let passCount = 0;
let failCount = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  ✓ PASS: ${desc}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failCount++;
  }
}

async function runQualitySuite() {
  console.log('================================================================');
  console.log('  FULLSTACK QUALITY, STABILITY & EDGE-CASE TEST SUITE');
  console.log('================================================================\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management');
    console.log('[DB Connected]: Ready for quality verification\n');

    // Clean any previous test artifacts
    await Employee.deleteMany({ email: /@quality-audit\.com$/i });

    server = app.listen(PORT);

    // -------------------------------------------------------------
    // SECTION 1: HEALTH CHECK & PERSISTENCE
    // -------------------------------------------------------------
    console.log('--- [SECTION 1: SYSTEM HEALTH & PERSISTENCE] ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    check('Health endpoint returns HTTP 200', healthRes.status === 200);
    check('Health response reports database connected', healthData.database?.status === 'connected');
    check('Consistent JSON format (success: true)', healthData.success === true);

    // -------------------------------------------------------------
    // SECTION 2: INPUT VALIDATION & BAD REQUESTS (HTTP 400)
    // -------------------------------------------------------------
    console.log('\n--- [SECTION 2: INPUT VALIDATION (HTTP 400)] ---');

    // Case 2.1: Empty Name
    const emptyNameRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'valid@quality-audit.com', department: 'Engineering', designation: 'Developer' })
    });
    const emptyNameData = await emptyNameRes.json();
    check('Empty name rejected with 400 Bad Request', emptyNameRes.status === 400 && emptyNameData.success === false);

    // Case 2.2: Empty Email
    const emptyEmailRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Name', email: '   ', department: 'Engineering', designation: 'Developer' })
    });
    const emptyEmailData = await emptyEmailRes.json();
    check('Empty email rejected with 400 Bad Request', emptyEmailRes.status === 400 && emptyEmailData.success === false);

    // Case 2.3: Invalid Email Format
    const invalidEmailRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Name', email: 'not-an-email@domain', department: 'Engineering', designation: 'Developer' })
    });
    const invalidEmailData = await invalidEmailRes.json();
    check('Malformed email rejected with 400 Bad Request', invalidEmailRes.status === 400 && invalidEmailData.success === false);

    // Case 2.4: Empty Department
    const emptyDeptRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Name', email: 'valid2@quality-audit.com', department: '', designation: 'Developer' })
    });
    check('Empty department rejected with 400 Bad Request', emptyDeptRes.status === 400);

    // Case 2.5: Empty Designation
    const emptyDesigRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Valid Name', email: 'valid3@quality-audit.com', department: 'Engineering', designation: '  ' })
    });
    check('Empty designation rejected with 400 Bad Request', emptyDesigRes.status === 400);

    // -------------------------------------------------------------
    // SECTION 3: CORE CRUD & DUPLICATE CONFLICT (HTTP 201, 409, 200)
    // -------------------------------------------------------------
    console.log('\n--- [SECTION 3: CRUD OPERATIONS & CONFLICT HANDLING] ---');

    // Case 3.1: Create Valid Employee
    const createRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Samantha Ray',
        email: 'samantha.ray@quality-audit.com',
        department: 'Product',
        designation: 'Staff Product Manager'
      })
    });
    const createData = await createRes.json();
    check('Valid employee created with HTTP 201', createRes.status === 201 && createData.success === true);
    check('Employee object contains _id and timestamps', Boolean(createData.data?._id && createData.data?.createdAt));
    const empId = createData.data._id;

    // Case 3.2: Duplicate Email Rejection (HTTP 409)
    const dupRes = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Person',
        email: 'samantha.ray@quality-audit.com',
        department: 'Finance',
        designation: 'Accountant'
      })
    });
    const dupData = await dupRes.json();
    check('Duplicate email rejected with HTTP 409 Conflict', dupRes.status === 409 && dupData.success === false);

    // Case 3.3: Get Employee by ID
    const getByIdRes = await fetch(`${BASE_URL}/employees/${empId}`);
    const getByIdData = await getByIdRes.json();
    check('Get employee by ID returns HTTP 200', getByIdRes.status === 200 && getByIdData.data.name === 'Samantha Ray');

    // Case 3.4: Update Employee
    const updateRes = await fetch(`${BASE_URL}/employees/${empId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designation: 'Senior Director of Product',
        department: 'Product Strategy'
      })
    });
    const updateData = await updateRes.json();
    check('Update employee returns HTTP 200', updateRes.status === 200 && updateData.data.designation === 'Senior Director of Product');

    // -------------------------------------------------------------
    // SECTION 4: SEARCH, FILTER, SORT & PAGINATION
    // -------------------------------------------------------------
    console.log('\n--- [SECTION 4: SEARCH, FILTERING, SORTING & PAGINATION] ---');

    // Create a 2nd employee for multi-record operations
    await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kenji Takahashi',
        email: 'kenji.takahashi@quality-audit.com',
        department: 'Engineering',
        designation: 'Cloud Infrastructure Lead'
      })
    });

    // Case 4.1: Search by Name
    const searchNameRes = await fetch(`${BASE_URL}/employees?search=Kenji`);
    const searchNameData = await searchNameRes.json();
    check('Search by name matches Kenji Takahashi', searchNameData.data.some(e => e.name.includes('Kenji')));

    // Case 4.2: Search by Email
    const searchEmailRes = await fetch(`${BASE_URL}/employees?search=samantha.ray`);
    const searchEmailData = await searchEmailRes.json();
    check('Search by email matches Samantha Ray', searchEmailData.data.some(e => e.email.includes('samantha.ray')));

    // Case 4.3: Filter by Department
    const filterDeptRes = await fetch(`${BASE_URL}/employees?department=Engineering`);
    const filterDeptData = await filterDeptRes.json();
    check('Department filter returns only Engineering records', filterDeptData.data.every(e => e.department.toLowerCase() === 'engineering'));

    // Case 4.4: Pagination Metadata
    const pageRes = await fetch(`${BASE_URL}/employees?page=1&limit=2`);
    const pageData = await pageRes.json();
    check('Pagination returns correct page and limit structure', pageData.pagination?.page === 1 && pageData.pagination?.limit === 2);

    // -------------------------------------------------------------
    // SECTION 5: RESOURCE NOT FOUND & MALFORMED IDS (HTTP 400, 404)
    // -------------------------------------------------------------
    console.log('\n--- [SECTION 5: ERROR HANDLING & MISSING RESOURCES] ---');

    // Case 5.1: Malformed ObjectId (HTTP 400)
    const malformedIdRes = await fetch(`${BASE_URL}/employees/not-a-valid-mongo-id`);
    check('Malformed ObjectId returns HTTP 400 Bad Request', malformedIdRes.status === 400);

    // Case 5.2: Non-existent ObjectId (HTTP 404)
    const nonExistentRes = await fetch(`${BASE_URL}/employees/65f1a2b3c4d5e6f7a8b9c0d1`);
    check('Non-existent ObjectId returns HTTP 404 Not Found', nonExistentRes.status === 404);

    // Case 5.3: Delete Employee (HTTP 200)
    const deleteRes = await fetch(`${BASE_URL}/employees/${empId}`, { method: 'DELETE' });
    check('Delete employee returns HTTP 200', deleteRes.status === 200);

    // Case 5.4: Confirm Deleted Employee returns 404
    const confirmDeleteRes = await fetch(`${BASE_URL}/employees/${empId}`);
    check('Deleted record no longer accessible (HTTP 404)', confirmDeleteRes.status === 404);

    // Clean up
    await Employee.deleteMany({ email: /@quality-audit\.com$/i });

  } catch (err) {
    console.error('Fatal execution failure:', err);
    failCount++;
  } finally {
    if (server) server.close();
    await mongoose.connection.close();

    console.log('\n================================================================');
    console.log(`  E2E TEST SUMMARY: Total: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
    console.log('================================================================\n');

    process.exit(failCount > 0 ? 1 : 0);
  }
}

runQualitySuite();
