// Mock window.location for testing
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    origin: 'http://localhost:8000',
    pathname: '/',
    href: 'http://localhost:8000/'
  }
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve())
  }
});

// Console warnings and errors are noisy in tests, let's mock them
global.console = {
  ...global.console,
  // Keep native behavior for other methods
  warn: jest.fn(),
  error: jest.fn()
};