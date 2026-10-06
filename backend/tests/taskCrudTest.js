const http = require('http');

const request = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTaskTests() {
  console.log('🧪 Starting Task Management API Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Invalid Create: Missing title
    const res1 = await request('POST', '/api/tasks', {});
    assert(
      res1.status === 400 && res1.data.success === false,
      'POST /api/tasks: Rejects missing title with 400 Bad Request',
      `Got status ${res1.status}`
    );

    // 2. Invalid Create: Title too short
    const res2 = await request('POST', '/api/tasks', { title: 'ab' });
    assert(
      res2.status === 400 && res2.data.success === false,
      'POST /api/tasks: Rejects title < 3 chars with 400 Bad Request',
      `Got status ${res2.status}`
    );

    // 3. Invalid Create: Invalid status
    const res3 = await request('POST', '/api/tasks', { title: 'Valid Title Here', status: 'InvalidStatus' });
    assert(
      res3.status === 400 && res3.data.success === false,
      'POST /api/tasks: Rejects invalid status with 400 Bad Request',
      `Got status ${res3.status}`
    );

    // 4. Invalid Create: Invalid priority
    const res4 = await request('POST', '/api/tasks', { title: 'Valid Title Here', priority: 'SuperUrgent' });
    assert(
      res4.status === 400 && res4.data.success === false,
      'POST /api/tasks: Rejects invalid priority with 400 Bad Request',
      `Got status ${res4.status}`
    );

    // 5. Valid Create: Standalone task with all suggested fields
    const res5 = await request('POST', '/api/tasks', {
      title: 'Automated Test Task For Verification',
      description: 'Verifying end-to-end task operations with consistent JSON responses',
      status: 'Pending',
      priority: 'High',
      dueDate: '2026-11-20'
    });
    assert(
      res5.status === 201 && res5.data.success === true && res5.data.data?._id,
      'POST /api/tasks: Creates task with 201 Created and consistent JSON',
      JSON.stringify(res5.data)
    );
    const createdTask = res5.data?.data;
    const taskId = createdTask?._id;

    // 6. Retrieve Task by ID
    const res6 = await request('GET', `/api/tasks/${taskId}`);
    assert(
      res6.status === 200 && res6.data.success === true && res6.data.data?._id === taskId,
      'GET /api/tasks/:id: Retrieves task by valid ID with 200 OK',
      JSON.stringify(res6.data)
    );

    // 7. Retrieve Task by Invalid ID Format
    const res7 = await request('GET', '/api/tasks/not-a-valid-id');
    assert(
      res7.status === 400 && res7.data.success === false,
      'GET /api/tasks/:id: Returns 400 for malformed ID',
      `Got status ${res7.status}`
    );

    // 8. Retrieve Task Missing / Non-existent ID
    const res8 = await request('GET', '/api/tasks/64b1f2e3d4c5b6a789012345');
    assert(
      res8.status === 404 && res8.data.success === false,
      'GET /api/tasks/:id: Returns 404 for missing task record',
      `Got status ${res8.status}`
    );

    // 9. Search tasks by title
    const res9 = await request('GET', '/api/tasks?search=Automated+Test+Task');
    assert(
      res9.status === 200 && res9.data.success === true && res9.data.data?.length > 0,
      'GET /api/tasks?search=...: Searches tasks matching title',
      `Count: ${res9.data?.count}`
    );

    // 10. Filter tasks by status
    const res10 = await request('GET', '/api/tasks?status=Pending');
    assert(
      res10.status === 200 && res10.data.success === true && res10.data.data?.every((t) => t.status === 'Pending'),
      'GET /api/tasks?status=Pending: Filters tasks by status',
      `Found ${res10.data?.count} tasks`
    );

    // 11. Filter tasks by priority
    const res11 = await request('GET', '/api/tasks?priority=High');
    assert(
      res11.status === 200 && res11.data.success === true && res11.data.data?.every((t) => t.priority === 'High'),
      'GET /api/tasks?priority=High: Filters tasks by priority',
      `Found ${res11.data?.count} tasks`
    );

    // 12. Update task by ID
    const res12 = await request('PUT', `/api/tasks/${taskId}`, {
      title: 'Automated Test Task (Updated Title)',
      status: 'In Progress',
      priority: 'Urgent'
    });
    assert(
      res12.status === 200 &&
        res12.data.success === true &&
        res12.data.data?.status === 'In Progress' &&
        res12.data.data?.priority === 'Urgent',
      'PUT /api/tasks/:id: Updates task with 200 OK and validates status transition',
      JSON.stringify(res12.data)
    );

    // 13. Update task with invalid priority
    const res13 = await request('PUT', `/api/tasks/${taskId}`, {
      priority: 'NonExistentPriority'
    });
    assert(
      res13.status === 400 && res13.data.success === false,
      'PUT /api/tasks/:id: Rejects invalid priority on update with 400 Bad Request',
      `Got status ${res13.status}`
    );

    // 14. Delete task by ID
    const res14 = await request('DELETE', `/api/tasks/${taskId}`);
    assert(
      res14.status === 200 && res14.data.success === true && res14.data.data?.id === taskId,
      'DELETE /api/tasks/:id: Deletes task with 200 OK',
      JSON.stringify(res14.data)
    );

    // 15. Verify task is deleted
    const res15 = await request('GET', `/api/tasks/${taskId}`);
    assert(
      res15.status === 404 && res15.data.success === false,
      'GET /api/tasks/:id: Confirms deletion with 404 Not Found',
      `Got status ${res15.status}`
    );

    console.log(`\n========================================`);
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTaskTests();
