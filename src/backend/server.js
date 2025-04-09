/* eslint-env browser, node, es2021 */
/* eslint "eslint:recommended" */
/* prettier singleQuote:true, semi:false */

const express = require('express');
const path = require('path');
const { initializeDatabase } = require('../../db/schema');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// Register API routes
app.use('/api', routes);

// Handle redirect routes - must be after API routes
app.get('/:hash', routes.redirectToOriginalUrl);

// Catch-all route to return the main index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
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
