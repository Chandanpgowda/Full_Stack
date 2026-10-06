const dotenv = require('dotenv');

// Load environment variables before any other module
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server]: Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection Error]: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server]: Gracefully shutting down...');
    server.close(() => {
      console.log('[Server]: Closed all active HTTP connections');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
