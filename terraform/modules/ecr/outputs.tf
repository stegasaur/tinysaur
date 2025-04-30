output "repository_url" {
  description = "The URL of the repository"
  value       = aws_ecr_repository.app.repository_url
}

output "repository_name" {
  description = "The name of the repository"
  value       = aws_ecr_repository.app.name
}

output "repository_arn" {
  description = "The ARN of the repository"
  value       = aws_ecr_repository.app.arn
}
