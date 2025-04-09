#!/usr/bin/env node

/**
 * Database schema push script for URL Shortener application
 * 
 * This script uses Drizzle ORM to push schema changes to the database.
 * It's a simpler alternative to migrations when you don't need to preserve data
 * or during development.
 */

require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { urls, users } = require('../shared/schema');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const db = drizzle(pool);

async function pushSchemaChanges() {
  try {
    console.log('Pushing schema changes to database...');
    
    // Create tables based on schema definitions
    await db.execute(`
      -- Create users table if it doesn't exist
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create urls table if it doesn't exist
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        hash VARCHAR(10) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      );
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_hash ON urls(hash);
      CREATE INDEX IF NOT EXISTS idx_user_id ON urls(user_id);
    `);
    
    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the push
pushSchemaChanges().catch(err => {
  console.error('Schema push failed:', err);
  process.exit(1);
});