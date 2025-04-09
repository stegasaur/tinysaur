import request from 'supertest';
import { createServer } from '../../src/backend/server';

describe('API Endpoints', () => {
  let app;
  let mockUrlService;

  beforeEach(() => {
    // Create mock URL service
    mockUrlService = {
      shorten: jest.fn((url) => Promise.resolve('abc123')),
      resolve: jest.fn((hash) => {
        if (hash === 'abc123') {
          return Promise.resolve('https://example.com');
        }
        return Promise.resolve(null);
      })
    };

    // Create Express app with mocked URL service
    app = createServer(mockUrlService);
  });

  describe('POST /api/shorten', () => {
    it('should shorten a valid URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'https://example.com' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('shortUrl', 'abc123');
      expect(mockUrlService.shorten).toHaveBeenCalledWith('https://example.com');
    });

    it('should return 400 for an invalid URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({ url: 'invalid-url' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(mockUrlService.shorten).not.toHaveBeenCalled();
    });

    it('should return 400 if URL is missing', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(mockUrlService.shorten).not.toHaveBeenCalled();
    });
  });

  describe('GET /:hash', () => {
    it('should redirect to the original URL', async () => {
      const response = await request(app)
        .get('/abc123')
        .expect(301);

      expect(response.header.location).toBe('https://example.com');
      expect(mockUrlService.resolve).toHaveBeenCalledWith('abc123');
    });

    it('should return 404 for a non-existent hash', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(mockUrlService.resolve).toHaveBeenCalledWith('nonexistent');
    });
  });
});