resource "aws_codecommit_repository" "repo" {
  repository_name = "${var.project_name}-${var.environment}"

  tags = {
    Name        = var.project_name
    Environment = var.environment
  }
}
