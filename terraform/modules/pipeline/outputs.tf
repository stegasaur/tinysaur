output "codecommit_repo_url" {
  description = "The URL of the CodeCommit repository"
  value       = aws_codecommit_repository.repo.clone_url_http
}
