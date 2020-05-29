output "curvytron_endpoint" {
  value = aws_lb.curvytron.dns_name
}

output "curvytron_ecr_repo" {
  value = aws_ecr_repository.curvytron.repository_url
}