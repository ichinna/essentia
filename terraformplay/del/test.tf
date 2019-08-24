/*
 * Copyright 2019 Cloud Elements
 *
 * AWS IAM role for RDS enhanced monitoring 
*/

data "aws_iam_policy_document" "rds_enhanced_monitoring" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["monitoring.rds.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "iam_role_rds" {
  name               = "RDSEnhancedMonitoring"
  assume_role_policy = data.aws_iam_policy_document.rds_enhanced_monitoring.json
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.iam_role_rds.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

data "aws_iam_role" "rds_role" {
  name = "RDSEnhancedMonitoring"
}



output "ufff" {
  value = "${data.aws_iam_role.rds_role.arn}"
}