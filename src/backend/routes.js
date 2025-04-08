const express = require('express');
const urlService = require('./urlService');

const router = express.Router();

// POST endpoint to shorten a URL
router.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }
    
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }
    
    // Generate or retrieve shortened URL
    const result = await urlService.shortenUrl(url);
    
    return res.status(200).json({ shortUrl: result.hash });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Redirect endpoint
const redirectToOriginalUrl = async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({ message: 'Hash parameter is required' });
    }
    
    const urlData = await urlService.getOriginalUrl(hash);
    
    if (!urlData) {
      return res.status(404).sendFile('public/index.html', { root: '.' });
    }
    
    // Redirect to the original URL with HTTP 301 (Moved Permanently)
    return res.status(301).redirect(urlData.original_url);
  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

router.redirectToOriginalUrl = redirectToOriginalUrl;

module.exports = router;
