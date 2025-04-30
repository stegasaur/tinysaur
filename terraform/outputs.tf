output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "alb_security_group_id" {
  description = "Security group ID for the ALB"
  value       = module.security_groups.alb_sg_id
}

output "ecs_security_group_id" {
  description = "Security group ID for the ECS tasks"
  value       = module.security_groups.ecs_sg_id
}

output "rds_security_group_id" {
  description = "Security group ID for the RDS instance"
  value       = module.security_groups.rds_sg_id
}

output "db_endpoint" {
  description = "The endpoint of the database"
  value       = module.rds.db_endpoint
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = module.ecs.alb_dns_name
}

output "database_url" {
  description = "The connection string for the database"
  value       = "postgresql://${module.rds.db_endpoint}/${var.db_name}"
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = module.ecs.service_name
}
