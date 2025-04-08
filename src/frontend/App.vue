<template>
  <div class="container">
    <div class="header">
      <h1>URL Shortener</h1>
      <p>Shorten your long URLs with a single click</p>
    </div>
    
    <div class="url-form">
      <form @submit.prevent="shortenUrl">
        <div class="form-group">
          <label for="urlInput">Enter your URL</label>
          <input 
            type="url" 
            class="form-control url-input" 
            id="urlInput" 
            v-model="url" 
            placeholder="https://example.com"
            required
          >
          <div v-if="urlError" class="alert alert-danger mt-2">
            {{ urlError }}
          </div>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary shorten-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </button>
      </form>
    </div>
    
    <div v-if="shortenedUrl" class="result-card">
      <h3>Your Shortened URL:</h3>
      <div class="alert alert-success">
        <a :href="shortenedUrl" target="_blank" class="short-url">{{ shortenedUrl }}</a>
        <button class="btn btn-secondary copy-btn" @click="copyToClipboard">
          {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
        </button>
      </div>
    </div>
    
    <div v-if="apiError" class="alert alert-danger mt-3">
      {{ apiError }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      url: '',
      shortenedUrl: '',
      isLoading: false,
      urlError: '',
      apiError: '',
      copied: false
    };
  },
  methods: {
    validateUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (err) {
        return false;
      }
    },
    async shortenUrl() {
      // Reset states
      this.urlError = '';
      this.apiError = '';
      this.shortenedUrl = '';
      this.copied = false;
      
      // Validate URL
      if (!this.url) {
        this.urlError = 'Please enter a URL';
        return;
      }
      
      if (!this.validateUrl(this.url)) {
        this.urlError = 'Please enter a valid URL with http:// or https://';
        return;
      }
      
      // Make API request
      this.isLoading = true;
      try {
        const response = await axios.post('/api/shorten', { url: this.url });
        
        if (response.data && response.data.shortUrl) {
          const host = window.location.origin;
          this.shortenedUrl = `${host}/${response.data.shortUrl}`;
        } else {
          this.apiError = 'Failed to shorten URL. Please try again.';
        }
      } catch (error) {
        console.error('Error shortening URL:', error);
        this.apiError = error.response?.data?.message || 'An error occurred while shortening the URL. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    copyToClipboard() {
      if (navigator.clipboard && this.shortenedUrl) {
        navigator.clipboard.writeText(this.shortenedUrl)
          .then(() => {
            this.copied = true;
            setTimeout(() => {
              this.copied = false;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      }
    }
  }
};
</script>
