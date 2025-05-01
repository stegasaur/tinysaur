const express = require('express');
const path = require('path');
const { initializeDatabase } = require('../../db/schema');
const routes = require('./routes');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  // Ensure logs go to stdout for container environments like ECS
  app.use(morgan('combined', {
    stream: process.stdout
  }));
  // Add a startup log to confirm logging is working
  console.log(`[${new Date().toISOString()}] Morgan logging initialized in production mode`);
}

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

// add a health check endpoint and turn off logging for it
app.use('/__health', (req, res, next) => {
  if (req.method === 'GET') {
    // Disable logging for health check
    req.morganSkip = true;
  }
  next();
});

// Register API routes
app.use('/api', routes);

// Handle redirect routes - must be after API routes
app.get('/:hash', routes.redirectToOriginalUrl);

// Catch-all route to return the main index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Initialize the database before starting the server
const startServer = async () => {
  const dbInitialized = await initializeDatabase();

  if (dbInitialized) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
  } else {
    console.error('Failed to initialize the database. Server not started.');
    process.exit(1);
  }
};

module.exports = { app, startServer };
