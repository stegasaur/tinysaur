import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}
const caCertPath = process.env.CA_CERT_PATH;
let caCert;
if (caCertPath) {
  let caCertFullPath = require('path').resolve(process.cwd(), caCertPath);
  try {
    caCert = require('fs').readFileSync(caCertPath);
  } catch (error) {
    console.error(`Error reading CA certificate from ${caCertPath}:`, error);
  }
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: caCert
  }
});

export const db = drizzle(pool, { schema });

// Initialize the database by creating tables if they don't exist
export const initializeDb = async () => {
  try {
    // Create the users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the urls table with hash field indexed and foreign key reference
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        hash VARCHAR(10) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Create an index on the hash field for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_hash ON urls(hash);
    `);

    // Create an index on the user_id field for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON urls(user_id);
    `);

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
