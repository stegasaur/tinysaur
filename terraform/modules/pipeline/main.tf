resource "aws_codecommit_repository" "repo" {
  repository_name = var.codecommit_repo_name
  description     = var.codecommit_repo_description

  tags = {
    Name        = var.codecommit_repo_name
    Environment = var.environment
  }
}
