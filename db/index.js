const { pool, initializeDatabase } = require('./schema');

// Function to store a URL and its hash
const storeUrl = async (originalUrl, hash) => {
  try {
    const query = 'INSERT INTO urls (original_url, hash) VALUES ($1, $2) RETURNING *';
    const values = [originalUrl, hash];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error storing URL:', error);
    throw error;
  }
};

// Function to retrieve a URL by its hash
const getUrlByHash = async (hash) => {
  try {
    const query = 'SELECT * FROM urls WHERE hash = $1';
    const values = [hash];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving URL:', error);
    throw error;
  }
};

// Function to check if a URL already exists
const checkUrlExists = async (originalUrl) => {
  try {
    const query = 'SELECT * FROM urls WHERE original_url = $1';
    const values = [originalUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error checking URL existence:', error);
    throw error;
  }
};

module.exports = {
  storeUrl,
  getUrlByHash,
  checkUrlExists,
  initializeDatabase
};
