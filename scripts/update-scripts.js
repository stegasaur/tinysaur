/* eslint-env browser, node, es2021 */
/* eslint "eslint:recommended" */
/* prettier singleQuote:true, semi:false */

// Script to programmatically update package.json scripts
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, '../package.json');

// Read the current package.json
const packageJson = require(packageJsonPath);

// Update the scripts section
packageJson.scripts = {
  "start": "node index.js",
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
  "dev:server": "node scripts/dev-server.js",
  "dev:client": "node scripts/dev-client.js",
  "build": "vite build",
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write .",
  "prepare": "husky install"
};

// Write the updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2),
  'utf8'
);

console.log('Successfully updated package.json scripts');
