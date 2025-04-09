# Deployment Guide

This document provides instructions for deploying the URL Shortener application to various environments.

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL database
- Git
- Docker (for containerized deployment)
- AWS CLI (for AWS deployment)
- Terraform (for infrastructure as code)

## Environment Variables

The following environment variables must be set for the application to function properly:

- `DATABASE_URL`: The PostgreSQL connection string
- `PORT` (optional): The port on which the server will run (default: 3000)
- `NODE_ENV`: The environment (development, production)

## Deployment Options

### Option 1: Deploying to Replit

1. Fork this project on Replit.
2. Provision a PostgreSQL database in Replit.
3. Set the required environment variables in the Replit Secrets panel.
4. Run the application using the "Run" button.

### Option 2: Manual Deployment

#### Preparing for Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Set environment variables:
   ```bash
   export DATABASE_URL=postgresql://username:password@host:port/database
   export NODE_ENV=production
   export PORT=3000
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Option 3: Deploying with PM2 (Production)

[PM2](https://pm2.keymetrics.io/) is a production process manager for Node.js applications.

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Create an ecosystem.config.js file:
   ```javascript
   module.exports = {
     apps: [{
       name: "url-shortener",
       script: "index.js",
       env: {
         NODE_ENV: "production",
         PORT: 3000,
         DATABASE_URL: "postgresql://username:password@host:port/database"
       },
       instances: "max",
       exec_mode: "cluster"
     }]
   };
   ```

3. Start the application with PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

4. Save the PM2 process list:
   ```bash
   pm2 save
   ```

5. Set up PM2 to start on boot:
   ```bash
   pm2 startup
   ```

### Option 4: Containerized Deployment with Docker

This application includes a Dockerfile for containerized deployment.

1. Build the Docker image:
   ```bash
   docker build -t urltiny:latest .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL=postgresql://username:password@host:port/database \
     -e NODE_ENV=production \
     urltiny:latest
   ```

### Option 5: AWS ECS Deployment with Terraform

This project includes Terraform configurations for deploying to AWS ECS.

#### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (v1.0+)

#### Deployment Steps

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Create a `terraform.tfvars` file based on the example:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Modify the `terraform.tfvars` file with your specific values, particularly:
   - AWS region
   - Database credentials
   - Domain name (if using HTTPS)

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Plan the infrastructure changes:
   ```bash
   terraform plan
   ```

6. Apply the changes to create the infrastructure:
   ```bash
   terraform apply
   ```

7. After successful application, Terraform will output important information:
   - ALB DNS name (for accessing the application)
   - Database endpoint
   - ECR repository URL (for pushing Docker images)

8. Build and push the Docker image to ECR:
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build the image
   docker build -t urltiny:latest .
   
   # Tag the image
   docker tag urltiny:latest <ecr-repository-url>:latest
   
   # Push the image
   docker push <ecr-repository-url>:latest
   ```

9. Update the ECS service to use the new image:
   ```bash
   aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
   ```

#### Updating the Infrastructure

To update the infrastructure after making changes to the Terraform files:

```bash
terraform plan  # Review changes
terraform apply # Apply changes
```

#### Destroying the Infrastructure

When you no longer need the infrastructure:

```bash
terraform destroy
```

## SSL/TLS Configuration

For production deployments, it's recommended to use SSL/TLS to secure your application. This can be achieved through a reverse proxy like Nginx.

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourshortener.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourshortener.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Backups

It's recommended to set up regular database backups for production deployments.

Example automated backup script:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
DATABASE_NAME="url_shortener"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run the backup
pg_dump -U postgres -d $DATABASE_NAME -F c -f $BACKUP_DIR/backup_$TIMESTAMP.dump

# Keep only the last 7 days of backups
find $BACKUP_DIR -name "backup_*.dump" -type f -mtime +7 -delete
```

## Monitoring

For production deployments, it's recommended to set up monitoring to track the application's health and performance.

### PM2 Monitoring

PM2 provides built-in monitoring capabilities:

```bash
pm2 monit
```

### External Monitoring Services

Consider using external monitoring services like:
- [New Relic](https://newrelic.com/)
- [Datadog](https://www.datadoghq.com/)
- [Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/)

## Troubleshooting

### Common Issues

1. **Database Connection Failures**:
   - Verify the DATABASE_URL is correct
   - Check that the PostgreSQL server is running
   - Ensure network access to the database is allowed

2. **Port Already in Use**:
   - Change the PORT environment variable
   - Check for other applications using the same port

3. **Missing Environment Variables**:
   - Verify all required environment variables are set

4. **AWS ECS Deployment Issues**:
   - Check CloudWatch logs for the ECS service
   - Verify that the ECR image was built and pushed correctly
   - Make sure the task definition is up to date
   - Check security group rules to ensure proper network connectivity
   - Verify that the database connection string is correct in Secrets Manager

5. **Terraform Errors**:
   - Make sure your AWS credentials are configured correctly
   - Check for syntax errors in Terraform files
   - Ensure all required variables are defined in terraform.tfvars
   - Run `terraform validate` to check for configuration errors
   - Check for conflicting resource names or duplicate declarations

For more assistance, check the application logs or create an issue on the project's GitHub repository.