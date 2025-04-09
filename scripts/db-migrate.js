#!/usr/bin/env node

/**
 * Database migration script for URL Shortener application
 * 
 * This script performs migrations using SQL queries directly.
 * It checks for existing tables and columns and adds missing ones.
 */

require('dotenv').config();
const { Pool } = require('pg');

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

async function runMigration() {
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    console.log('Starting migration...');

    // Check if users table exists
    const { rows: tableCheck } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as "exists";
    `);
    
    if (!tableCheck[0].exists) {
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // Check if urls table exists
    const { rows: urlsTableCheck } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'urls'
      ) as "exists";
    `);
    
    if (!urlsTableCheck[0].exists) {
      console.log('Creating urls table...');
      await client.query(`
        CREATE TABLE urls (
          id SERIAL PRIMARY KEY,
          original_url TEXT NOT NULL,
          hash VARCHAR(10) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
        
        CREATE INDEX idx_hash ON urls(hash);
        CREATE INDEX idx_user_id ON urls(user_id);
      `);
    } else {
      // Check if user_id column exists in urls table
      const { rows: columnCheck } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'urls' AND column_name = 'user_id'
        ) as "exists";
      `);
      
      if (!columnCheck[0].exists) {
        console.log('Adding user_id column to urls table...');
        await client.query(`
          ALTER TABLE urls 
          ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
          
          CREATE INDEX idx_user_id ON urls(user_id);
        `);
      }
    }

    // Create hash index if not exists
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'idx_hash'
        ) THEN
          CREATE INDEX idx_hash ON urls(hash);
        END IF;
      END
      $$;
    `);

    // Commit transaction
    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration().catch(err => {
  console.error('Migration script error:', err);
  process.exit(1);
});