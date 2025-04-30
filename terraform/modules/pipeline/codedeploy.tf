# # CodeDeploy application and deployment group
# resource "aws_codedeploy_app" "app" {
#   name = "${var.project_name}-${var.environment}-app"

#   compute_platform = "ECS"

#   tags = {
#     Name        = "${var.project_name}-${var.environment}-app"
#     Environment = var.environment
#   }
# }

# resource "aws_codedeploy_deployment_group" "app" {
#   app_name              = aws_codedeploy_app.app.name
#   deployment_group_name = "${var.project_name}-${var.environment}-deployment-group"

#   service_role_arn = aws_iam_role.codedeploy_role.arn

#   deployment_style {
#     deployment_type = "BLUE_GREEN"
#     app_spec_arn    = aws_s3_bucket_object.app_spec.arn
#   }

#   load_balancer_info {
#     target_group_pair_info {
#       target_group {
#         name = aws_lb_target_group.app.name
#       }
#     }
#   }

#   trigger_configuration {
#     trigger_name = "${var.project_name}-${var.environment}-trigger"
#     trigger_target_arn = aws_sns_topic.codedeploy_notifications.arn
#     trigger_events = ["DeploymentFailure"]
#   }
# }
#   auto_rollback_configuration {
#     enabled = true

#     trigger_configuration {
#       trigger_name = "${var.project_name}-${var.environment}-rollback-trigger"
#       trigger_target_arn = aws_sns_topic.codedeploy_notifications.arn
#       trigger_events = ["DeploymentFailure"]
#     }
#   }

#   tags = {
#     Name        = "${var.project_name}-${var.environment}-deployment-group"
#     Environment = var.environment
#   }
# }
# # S3 bucket for CodeDeploy AppSpec file
# resource "aws_s3_bucket" "codedeploy_appspec" {
#   bucket = "${var.project_name}-${var.environment}-codedeploy-appspec"

#   tags = {
#     Name        = "${var.project_name}-${var.environment}-codedeploy-appspec"
#     Environment = var.environment
#   }
# }
# # S3 bucket ownership controls
# resource "aws_s3_bucket_ownership_controls" "codedeploy_appspec_ownership" {
#   bucket = aws_s3_bucket.codedeploy_appspec.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }
# # S3 bucket ACL
# resource "aws_s3_bucket_acl" "codedeploy_appspec_acl" {
#   depends_on = [aws_s3_bucket_ownership_controls.codedeploy_appspec_ownership]
#   bucket     = aws_s3_bucket.codedeploy_appspec.id
#   acl        = "private"
# }
# # S3 bucket object for AppSpec file
# resource "aws_s3_bucket_object" "app_spec" {
#   bucket = aws_s3_bucket.codedeploy_appspec.id
#   key    = "appspec.yml"
#   source = "${path.module}/appspec.yml"

#   tags = {
#     Name        = "${var.project_name}-${var.environment}-appspec"
#     Environment = var.environment
#   }
# }
# # S3 bucket object ownership controls
# resource "aws_s3_bucket_object_ownership_controls" "app_spec_ownership" {
#   bucket = aws_s3_bucket.codedeploy_appspec.id
#   key    = aws_s3_bucket_object.app_spec.key
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }
# # S3 bucket object ACL
# resource "aws_s3_bucket_object_acl" "app_spec_acl" {
#   depends_on = [aws_s3_bucket_object_ownership_controls.app_spec_ownership]
#   bucket     = aws_s3_bucket.codedeploy_appspec.id
#   key        = aws_s3_bucket_object.app_spec.key
#   acl        = "private"
# }
