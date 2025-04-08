const crypto = require('crypto');
const db = require('../../db/index');

// Generate a unique hash for a URL
const generateHash = (url) => {
  const hash = crypto.createHash('md5').update(url).digest('hex');
  return hash.substring(0, 7); // Using first 7 characters for shorter URLs
};

// Function to shorten a URL
const shortenUrl = async (originalUrl) => {
  try {
    // Check if URL already exists in the database
    const existingUrl = await db.checkUrlExists(originalUrl);
    
    if (existingUrl) {
      return existingUrl;
    }
    
    // Generate a hash for the URL
    let hash = generateHash(originalUrl);
    
    // Check if hash already exists (unlikely but possible with first 7 chars)
    let hashExists = await db.getUrlByHash(hash);
    
    // If hash collision occurs, regenerate with additional data
    if (hashExists) {
      const timestamp = Date.now().toString();
      hash = generateHash(originalUrl + timestamp);
    }
    
    // Store the URL and hash in the database
    const storedUrl = await db.storeUrl(originalUrl, hash);
    return storedUrl;
  } catch (error) {
    console.error('Error in shortenUrl service:', error);
    throw error;
  }
};

// Function to get the original URL from a hash
const getOriginalUrl = async (hash) => {
  try {
    return await db.getUrlByHash(hash);
  } catch (error) {
    console.error('Error in getOriginalUrl service:', error);
    throw error;
  }
};

module.exports = {
  shortenUrl,
  getOriginalUrl
};
