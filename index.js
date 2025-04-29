const { startServer } = require('./src/backend/server');
const { build } = require('vite');
const path = require('path');
const fs = require('fs');

// Build the frontend and then start the server
async function buildAndStart() {
  try {
    console.log('Building frontend application...');

    // Create dist directory if it doesn't exist
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Build the frontend
    await build();
    console.log('Build completed successfully!');

    // Start the server
    await startServer();
  } catch (error) {
    console.error('Error in build and start process:', error);
    process.exit(1);
  }
}

buildAndStart();
