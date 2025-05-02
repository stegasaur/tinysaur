provider "aws" {
  region = var.aws_region
  profile = var.profile
  allowed_account_ids = [ "551128382200", "084828602255" ]
}

terraform {
  backend "s3" {
    bucket = "stegasaur"
    key    = "tinysaur/terraform/state"
    profile = "stegasaur"
  }
}

resource "random_password" "password" {
  length           = 16
  special          = false
}

# Create AWS Secrets Manager secret for database URL
resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.project_name}-${var.environment}-db-url"
  description = "Database URL for tinysaur application"

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-url"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql://${var.db_username}:${random_password.password.result}@${module.rds.db_endpoint}/${var.db_name}"
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  vpc_name             = "${var.project_name}-${var.environment}"
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
  environment          = var.environment
}

# Security Groups Module
module "security_groups" {
  source = "./modules/security_groups"

  project_name = var.project_name
  vpc_id      = module.vpc.vpc_id
  environment = var.environment
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  project_name           = var.project_name
  environment           = var.environment
  db_name               = var.db_name
  db_username           = var.db_username
  db_password           = random_password.password.result
  db_instance_class     = var.db_instance_class
  database_subnet_ids   = module.vpc.private_subnet_ids
  rds_security_group_id = module.security_groups.rds_sg_id
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment = var.environment
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  project_name             = var.project_name
  environment              = var.environment
  aws_region               = var.aws_region
  vpc_id                   = module.vpc.vpc_id
  ecr_repository_url       = module.ecr.repository_url
  container_port           = var.container_port
  container_cpu            = var.container_cpu
  container_memory         = var.container_memory
  public_subnet_ids        = module.vpc.public_subnet_ids
  private_subnet_ids       = module.vpc.private_subnet_ids
  alb_security_group_id    = module.security_groups.alb_sg_id
  ecs_security_group_id    = module.security_groups.ecs_sg_id
  database_url_secret_arn  = aws_secretsmanager_secret.database_url.arn
  desired_count            = var.desired_count
  log_retention_in_days    = var.log_retention_in_days
  health_check_path        = var.health_check_path
  enable_https             = var.enable_https
  certificate_arn          = module.dns.acm_certificate_arn
  domain_name              = var.domain_name
  zone_id = module.dns.zone_id
}

# Hosted Zone and DNS Record Module
module "dns" {
  source = "./modules/dns"

  domain_name = var.domain_name
  environment = var.environment
}

# Pipeline Module
module "pipeline" {
  source = "./modules/pipeline"

  project_name     = var.project_name
  environment      = var.environment
  github_owner     = var.github_owner
  github_repo      = var.github_repo
  github_branch    = var.github_branch
  ecr_repository_name = module.ecr.repository_name
  ecr_repository_arn = module.ecr.repository_arn
  ecr_repository_url = module.ecr.repository_url
  ecs_cluster_name = module.ecs.cluster_name
  ecs_service_name = module.ecs.service_name
}
