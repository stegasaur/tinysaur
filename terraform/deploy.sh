#!/bin/bash

# Deploy script for Terraform AWS infrastructure

set -e

# Print usage information
function usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -e, --environment   Environment to deploy (dev, staging, prod)"
  echo "  -p, --plan          Generate and show Terraform plan only"
  echo "  -a, --apply         Apply Terraform changes"
  echo "  -d, --destroy       Destroy infrastructure"
  echo "  -h, --help          Show this help message"
  exit 1
}

# Default values
ENVIRONMENT="dev"
PLAN_ONLY=false
APPLY=false
DESTROY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -p|--plan)
      PLAN_ONLY=true
      shift
      ;;
    -a|--apply)
      APPLY=true
      shift
      ;;
    -d|--destroy)
      DESTROY=true
      shift
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

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "prod" ]]; then
  echo "Invalid environment: $ENVIRONMENT"
  echo "Must be one of: dev, staging, prod"
  exit 1
fi

# Ensure a valid operation is specified
if [[ "$PLAN_ONLY" == "false" && "$APPLY" == "false" && "$DESTROY" == "false" ]]; then
  echo "No operation specified. Use --plan, --apply, or --destroy."
  usage
fi

# Check required environment variables
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
  exit 1
fi

# Ensure DB_PASSWORD is set
if [[ -z "$DB_PASSWORD" ]]; then
  echo "DB_PASSWORD environment variable is required."
  exit 1
fi

# Create terraform.tfvars file if it doesn't exist
if [[ ! -f "terraform.tfvars" ]]; then
  echo "Creating terraform.tfvars from template..."
  cp terraform.tfvars.example terraform.tfvars
  
  # Update the environment in the tfvars file
  sed -i "s/environment     = \"dev\"/environment     = \"$ENVIRONMENT\"/" terraform.tfvars
  
  echo "Please update terraform.tfvars with your specific configuration values."
  exit 1
fi

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Validate Terraform configuration
echo "Validating Terraform configuration..."
terraform validate

# Execute the requested operation
if [[ "$DESTROY" == "true" ]]; then
  echo "Planning infrastructure destruction for environment: $ENVIRONMENT"
  terraform plan -destroy -var="environment=$ENVIRONMENT" -var="db_password=$DB_PASSWORD"
  
  echo "Are you sure you want to destroy the infrastructure for environment $ENVIRONMENT? [y/N]"
  read -r confirm
  if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    echo "Destroying infrastructure..."
    terraform destroy -auto-approve -var="environment=$ENVIRONMENT" -var="db_password=$DB_PASSWORD"
  else
    echo "Destruction cancelled."
  fi
elif [[ "$PLAN_ONLY" == "true" ]]; then
  echo "Planning infrastructure changes for environment: $ENVIRONMENT"
  terraform plan -var="environment=$ENVIRONMENT" -var="db_password=$DB_PASSWORD"
elif [[ "$APPLY" == "true" ]]; then
  echo "Planning infrastructure changes for environment: $ENVIRONMENT"
  terraform plan -var="environment=$ENVIRONMENT" -var="db_password=$DB_PASSWORD"
  
  echo "Do you want to apply these changes? [y/N]"
  read -r confirm
  if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    echo "Applying infrastructure changes..."
    terraform apply -auto-approve -var="environment=$ENVIRONMENT" -var="db_password=$DB_PASSWORD"
    
    # Output important information
    echo "Infrastructure deployment complete. Important information:"
    terraform output
  else
    echo "Apply cancelled."
  fi
fi

echo "Terraform operation completed successfully."