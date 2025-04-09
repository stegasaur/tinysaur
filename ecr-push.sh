#!/bin/bash

# This script builds a Docker image for the URL Shortener application and pushes it to AWS ECR

set -e

# Default values
REPOSITORY_NAME="urltiny"
TAG="latest"
AWS_REGION="us-east-1"
ENVIRONMENT="dev"

# Print usage information
function usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -r, --repository    ECR Repository name (default: urltiny)"
  echo "  -t, --tag           Image tag (default: latest)"
  echo "  -e, --environment   Environment (dev, staging, prod)"
  echo "  -h, --help          Show this help message"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -r|--repository)
      REPOSITORY_NAME="$2"
      shift 2
      ;;
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --region)
      AWS_REGION="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install it first."
  exit 1
fi

# Create full repository name with environment
FULL_REPOSITORY_NAME="${REPOSITORY_NAME}-${ENVIRONMENT}"

echo "Building and pushing Docker image to ECR:"
echo "Repository: $FULL_REPOSITORY_NAME"
echo "Tag: $TAG"
echo "Environment: $ENVIRONMENT"
echo "AWS Region: $AWS_REGION"

# Get the AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ $? -ne 0 ]; then
  echo "Failed to get AWS account ID. Make sure your AWS credentials are set up correctly."
  exit 1
fi

# ECR repository URL
ECR_REPO_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FULL_REPOSITORY_NAME"

# Check if repository exists, create it if it doesn't
aws ecr describe-repositories --repository-names "$FULL_REPOSITORY_NAME" --region "$AWS_REGION" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Repository $FULL_REPOSITORY_NAME does not exist. Creating it..."
  aws ecr create-repository --repository-name "$FULL_REPOSITORY_NAME" --region "$AWS_REGION"
fi

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Build the Docker image
echo "Building Docker image..."
docker build -t "$FULL_REPOSITORY_NAME:$TAG" .

# Tag the image with ECR repository URL
echo "Tagging Docker image..."
docker tag "$FULL_REPOSITORY_NAME:$TAG" "$ECR_REPO_URL:$TAG"

# Push the image to ECR
echo "Pushing Docker image to ECR..."
docker push "$ECR_REPO_URL:$TAG"

echo "Docker image successfully built and pushed to ECR:"
echo "$ECR_REPO_URL:$TAG"

# Tag the image with a timestamp if it's the latest tag
if [ "$TAG" == "latest" ]; then
  TIMESTAMP=$(date +%Y%m%d%H%M%S)
  echo "Also tagging with timestamp: $TIMESTAMP"
  docker tag "$FULL_REPOSITORY_NAME:$TAG" "$ECR_REPO_URL:$TIMESTAMP"
  docker push "$ECR_REPO_URL:$TIMESTAMP"
  echo "Tagged and pushed: $ECR_REPO_URL:$TIMESTAMP"
fi

echo "Done!"