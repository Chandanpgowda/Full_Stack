const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const healthRoutes = require('./routes/healthRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
// Dynamic CORS Delegate supporting multiple origins, trailing slashes,
// wildcard domains (*.onrender.com, *.vercel.app), Render subdomains, and dev origins.
const corsOptionDelegate = (reqOrigin, callback) => {
  // Allow requests with no Origin (mobile apps, curl, Postman, server-to-server)
  if (!reqOrigin || reqOrigin === 'null') {
    return callback(null, true);
  }

  const corsOrigin = process.env.CLIENT_ORIGIN;

  // If CLIENT_ORIGIN is not configured or set to '*', allow all origins
  if (!corsOrigin || corsOrigin.trim() === '*') {
    return callback(null, true);
  }

  const cleanReqOrigin = reqOrigin.trim().replace(/\/+$/, '').toLowerCase();

  // Split comma-separated allowed origins and normalize
  const allowedOrigins = corsOrigin
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, '').toLowerCase())
    .filter(Boolean);

  const isAllowed = allowedOrigins.some((allowed) => {
    if (allowed === cleanReqOrigin) return true;

    // Support wildcard patterns like *.onrender.com or *.vercel.app
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2);
      return cleanReqOrigin.endsWith('.' + domain) || cleanReqOrigin.endsWith('://' + domain);
    }

    // Support matching any .onrender.com domain if 'onrender.com' is listed
    if (allowed === 'onrender.com') {
      return cleanReqOrigin.endsWith('.onrender.com');
    }

    return false;
  });

  // Render & Localhost fallbacks: automatically allow .onrender.com subdomains & localhost
  const isRenderDomain = cleanReqOrigin.endsWith('.onrender.com');
  const isLocalhost = cleanReqOrigin.includes('localhost') || cleanReqOrigin.includes('127.0.0.1');

  if (isAllowed || isRenderDomain || isLocalhost) {
    return callback(null, true);
  }

  // Deny cleanly without throwing a 500 server error
  return callback(null, false);
};

app.use(cors({
  origin: corsOptionDelegate,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Management API is running',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      employees: 'GET /api/employees',
      createEmployee: 'POST /api/employees',
      getEmployee: 'GET /api/employees/:id',
      updateEmployee: 'PUT /api/employees/:id',
      deleteEmployee: 'DELETE /api/employees/:id'
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
