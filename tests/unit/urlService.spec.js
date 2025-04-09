import { jest } from '@jest/globals';
import { shortener } from '../../src/backend/urlService';

describe('urlService', () => {
  let mockDb;

  beforeEach(() => {
    // Create a mock database with in-memory storage
    mockDb = {
      urls: new Map(),
      addUrl: jest.fn((hash, url) => {
        mockDb.urls.set(hash, url);
        return Promise.resolve();
      }),
      getUrl: jest.fn((hash) => {
        return Promise.resolve(mockDb.urls.get(hash));
      })
    };
  });

  describe('generateHash', () => {
    it('should generate a unique hash for a URL', async () => {
      const url = 'https://example.com';
      const result = await shortener(mockDb).shorten(url);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(mockDb.addUrl).toHaveBeenCalledWith(result, url);
    });

    it('should generate different hashes for different URLs', async () => {
      const url1 = 'https://example.com';
      const url2 = 'https://another-example.com';
      
      const hash1 = await shortener(mockDb).shorten(url1);
      const hash2 = await shortener(mockDb).shorten(url2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('resolve', () => {
    it('should resolve a hash to its original URL', async () => {
      const url = 'https://example.com';
      const hash = await shortener(mockDb).shorten(url);
      
      const resolvedUrl = await shortener(mockDb).resolve(hash);
      expect(resolvedUrl).toBe(url);
      expect(mockDb.getUrl).toHaveBeenCalledWith(hash);
    });

    it('should return null for a non-existent hash', async () => {
      const resolvedUrl = await shortener(mockDb).resolve('nonexistent');
      expect(resolvedUrl).toBeNull();
    });
  });
});