# URL Shortener

A URL shortener application built with Vue.js on the frontend and Node.js with Express on the backend. This application allows users to shorten long URLs and provides a simple, shareable link.

## Features

- Shorten URLs with a simple form
- Copy shortened URLs to clipboard
- Redirect to original URL when visiting a shortened link
- PostgreSQL database for URL storage
- Responsive design for mobile and desktop

## Technology Stack

- **Frontend**: Vue 3, Axios, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Testing**: Jest, Vue Test Utils, Supertest
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Infrastructure**: Docker, AWS, Terraform

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- Docker (for containerized deployment)
- AWS CLI (for AWS deployment)
- Terraform (for infrastructure as code)

## Getting Started

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
   PORT=3000
   ```

### Running the application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The application will be running at:
   - Backend API: `http://localhost:3000`
   - Frontend: `http://localhost:8000`

## Project Structure

```
url-shortener/
├── db/                 # Database setup and migrations
├── server/             # Server-side TypeScript files
├── shared/             # Shared TypeScript definitions
├── src/
│   ├── backend/        # Backend Node.js application
│   └── frontend/       # Frontend Vue.js application
├── terraform/          # Terraform infrastructure as code
│   ├── modules/        # Reusable Terraform modules
│   ├── main.tf         # Main Terraform configuration
│   ├── variables.tf    # Terraform variables
│   └── outputs.tf      # Terraform outputs
├── tests/
│   └── unit/           # Unit tests
├── .github/
│   └── workflows/      # GitHub Actions workflows
├── public/             # Static assets
├── Dockerfile          # Docker configuration for containerization
├── .dockerignore       # Files to ignore in Docker build
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── jest.config.js      # Jest configuration
└── vite.config.js      # Vite configuration
```

## API Endpoints

- `POST /api/shorten`: Shortens a URL
  - Request Body: `{ "url": "https://example.com" }`
  - Response: `{ "shortUrl": "abc123" }`

- `GET /:hash`: Redirects to the original URL

## Development

### Code Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Deployment

The application can be deployed in multiple ways:

1. **Manual Deployment**: Deploy to any platform that supports Node.js applications.

2. **Docker Deployment**: Deploy using Docker for containerization.
   ```bash
   # Build Docker image
   docker build -t urltiny:latest .

   # Run Docker container
   docker run -p 3000:3000 -e DATABASE_URL=postgresql://username:password@host:port/database urltiny:latest
   ```

3. **AWS ECS with Terraform**: Deploy to AWS Elastic Container Service using Terraform for infrastructure as code.
   ```bash
   # Navigate to Terraform directory
   cd terraform

   # Initialize Terraform
   terraform init

   # Apply Terraform configuration
   terraform apply
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Database Migrations

For development environments, the application will automatically create the required tables on startup. For production environments, we use a more controlled approach:

1. Using Drizzle ORM's schema definitions in `shared/schema.ts`
2. Using the database migration scripts in the `scripts` directory
3. For AWS deployments, database migrations are handled during the ECS container startup

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.