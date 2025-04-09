# Deployment Guide for URL Shortener

This guide provides detailed instructions for deploying the URL Shortener application to production environments.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Domain name (optional, but recommended for production)

## Environment Setup

1. Create a `.env` file with the following variables:

```
PORT=5000  # Port to run the application on
DATABASE_URL=postgresql://username:password@hostname:port/database
NODE_ENV=production
```

## Deployment Steps

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build the frontend
npm run build
```

### 2. Start the Production Server

```bash
npm start
```

This will:
1. Build the Vue.js frontend into optimized static files
2. Initialize the PostgreSQL database
3. Start the Express server that serves both the API and the frontend

## Deployment Options

### Option 1: Deploying to Replit

1. Click the "Deploy" button in the Replit interface
2. Replit will automatically build and deploy your application
3. Your application will be available at `https://your-app-name.replit.app`

### Option 2: Traditional Server Deployment

1. Provision a server (e.g., AWS EC2, DigitalOcean Droplet)
2. Install Node.js and PostgreSQL
3. Clone your repository to the server
4. Set up your environment variables
5. Run the deployment steps above
6. (Optional) Set up a reverse proxy (e.g., Nginx) to handle HTTPS and domain routing

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Docker Deployment

1. Create a Dockerfile in your project root:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. Build and run the Docker container:

```bash
docker build -t url-shortener .
docker run -p 5000:5000 --env-file .env url-shortener
```

## Database Migrations

This application uses a simple initialization script that creates the necessary tables on startup. For proper migrations in a production environment, consider implementing a migration tool like:

- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [Drizzle ORM migrations](https://orm.drizzle.team/docs/migrations)

## Monitoring and Maintenance

- Set up application monitoring with tools like PM2 or Docker with automatic restarts
- Implement regular database backups
- Consider setting up logging with solutions like ELK Stack or Papertrail
- Set up HTTPS with Let's Encrypt for production environments

## Scaling Considerations

For high-traffic scenarios:

- Implement a Redis cache for frequently accessed URLs
- Set up a load balancer for distributing traffic across multiple application instances
- Consider using a CDN for static assets
- Implement rate limiting to prevent API abuse