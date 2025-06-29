project_name    = "tinysaur"
aws_region      = "us-east-1"

# VPC Configuration
vpc_cidr              = "10.0.0.0/16"
availability_zones    = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs  = ["10.0.3.0/24", "10.0.4.0/24"]

# RDS Configuration
db_name           = "tinysaurdb"
db_username       = "tinysaur_admin"
db_instance_class = "db.t3.micro"

# ECS Configuration
container_port       = 3000
container_cpu        = 256
container_memory     = 512
desired_count        = 2
log_retention_in_days = 30
health_check_path    = "/__health"

# Domain and HTTPS Configuration
enable_https     = true

# Github settings
github_owner     = "stegasaur"
github_repo      = "tinysaur"
github_branch    = "main"
