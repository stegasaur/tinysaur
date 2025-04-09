/* eslint-env browser, node, es2021 */
/* eslint "eslint:recommended" */
/* prettier singleQuote:true, semi:false */

const { Pool } = require('pg');
const crypto = require('crypto');

// Create a new pool using the environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to initialize the database and create tables
const initializeDatabase = async () => {
  try {
    // Create the urls table with hash field indexed
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        hash VARCHAR(10) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create an index on the hash field for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_hash ON urls(hash);
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

module.exports = {
  pool,
  initializeDatabase
};
