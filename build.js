/* eslint-env browser, node, es2021 */
/* eslint "eslint:recommended" */
/* prettier singleQuote:true, semi:false */

const { build } = require('vite');
const path = require('path');
const fs = require('fs');

async function buildApp() {
  console.log('Building frontend application...');
  
  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, 'public/dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  try {
    // Run Vite build
    await build();
    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

buildApp();
