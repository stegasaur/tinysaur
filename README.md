# URL Shortener Application

A modern URL shortener application built with Vue.js frontend and Node.js backend, using PostgreSQL for persistent storage of shortened URLs.

## Features

- Easy-to-use interface for shortening long URLs
- Secure hash generation for shortened URLs
- Copy-to-clipboard functionality
- Permanent storage of URL mappings in PostgreSQL database
- Automatic redirection from shortened URLs to original destinations
- RESTful API for integrating with other applications

## Tech Stack

- **Frontend**: Vue.js 3, Axios for API requests
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Build Tools**: Vite

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
DATABASE_URL=postgresql://username:password@hostname:port/database
```

## Development Setup

Follow these steps to set up the project for development:

1. **Clone the repository**

```bash
git clone <repository-url>
cd url-shortener
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

Ensure your PostgreSQL database is running and accessible with the credentials specified in your `.env` file.

4. **Run in development mode**

For development with hot-reloading of the frontend:

```bash
# Terminal 1: Run the backend
npm run dev:server

# Terminal 2: Run the frontend dev server
npm run dev:client
```

This will start the backend server on port 8000 and the development server for the frontend.

## Production Deployment

For production deployment:

1. **Build the frontend**

```bash
npm run build
```

2. **Start the production server**

```bash
npm start
```

This will build the Vue.js frontend and start the server that serves both the frontend assets and the API endpoints.

## Project Structure

```
url-shortener/
├── db/                   # Database configuration and schema
│   ├── index.js
│   └── schema.js
├── public/               # Static assets
│   ├── index.html
│   ├── style.css
│   └── dist/             # Built frontend assets (generated)
├── src/
│   ├── backend/          # Backend code
│   │   ├── routes.js     # API routes
│   │   ├── server.js     # Express server setup
│   │   └── urlService.js # URL shortening logic
│   └── frontend/         # Frontend code
│       ├── App.vue       # Main Vue component
│       └── main.js       # Vue entry point
├── .env                  # Environment variables
├── build.js              # Build script
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## API Endpoints

- `POST /api/shorten` - Shortens a URL
  - Request body: `{ "url": "https://example.com/long/url" }`
  - Response: `{ "shortUrl": "abc123" }`

- `GET /:hash` - Redirects to the original URL

## Scaling Considerations

For high-traffic scenarios:

- Consider adding Redis caching for frequently accessed URLs
- Implement rate limiting to prevent abuse
- Set up horizontal scaling with multiple application instances
- Add monitoring and analytics

## License

[MIT License](LICENSE)