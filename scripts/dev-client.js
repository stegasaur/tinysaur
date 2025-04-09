// Development client script
const { createServer } = require('vite');

async function startDevServer() {
  const server = await createServer({
    // Vite server options
    server: {
      port: 3000,
      // Proxy API requests to backend during development
      proxy: {
        '/api': 'http://localhost:8000',
        '/:hash': {
          target: 'http://localhost:8000',
          // Needed for dynamic parameters
          rewrite: (path) => path
        }
      }
    },
  });
  
  await server.listen();
  
  console.log('Frontend dev server running at:');
  server.printUrls();
}

startDevServer().catch(err => {
  console.error('Error starting Vite dev server:', err);
  process.exit(1);
});