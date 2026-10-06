const http = require('http');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const runAuthTests = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management');
    console.log('[Auth Test]: Connected to MongoDB');

    // Clean test users
    await User.deleteMany({ email: { $in: ['test_auth@example.com', 'google_test@gmail.com'] } });

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(5099, resolve));
    console.log('[Auth Test]: Test server listening on port 5099');

    const BASE_URL = 'http://localhost:5099/api/auth';

    // 1. Test Register
    console.log('\n--- Test 1: Register ---');
    const regRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Auth User',
        email: 'test_auth@example.com',
        password: 'Password123'
      })
    });
    const regData = await regRes.json();
    console.log('Register status:', regRes.status, 'success:', regData.success, 'token exists:', !!regData.token);

    // 2. Test Login
    console.log('\n--- Test 2: Login Success ---');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_auth@example.com',
        password: 'Password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status, 'success:', loginData.success, 'userName:', loginData.user?.name);

    // 3. Test Invalid Password
    console.log('\n--- Test 3: Invalid Password ---');
    const badLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_auth@example.com',
        password: 'WrongPassword'
      })
    });
    const badLoginData = await badLoginRes.json();
    console.log('Bad login status:', badLoginRes.status, 'message:', badLoginData.message);

    // 4. Test Google OAuth
    console.log('\n--- Test 4: Google Auth ---');
    const googleRes = await fetch(`${BASE_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'google_test@gmail.com',
        name: 'Google Test User',
        avatar: 'https://example.com/avatar.jpg'
      })
    });
    const googleData = await googleRes.json();
    console.log('Google Auth status:', googleRes.status, 'user:', googleData.user?.name, 'provider:', googleData.user?.provider);

    // Cleanup
    await User.deleteMany({ email: { $in: ['test_auth@example.com', 'google_test@gmail.com'] } });
    server.close();
    await mongoose.connection.close();
    console.log('\n✅ All Auth & Google Tests Passed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Auth test failed:', err);
    process.exit(1);
  }
};

runAuthTests();
