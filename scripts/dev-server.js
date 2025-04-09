/* eslint-env browser, node, es2021 */
/* eslint "eslint:recommended" */
/* prettier singleQuote:true, semi:false */

// Development server script
const { startServer } = require('../src/backend/server');

// Start the server without building the frontend
startServer().catch(error => {
  console.error('Error starting the development server:', error);
  process.exit(1);
});
