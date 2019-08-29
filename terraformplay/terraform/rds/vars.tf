variable "name" { }
variable "environment" { }
variable "aws_region" {
  default = "us-west-2"
}
variable "cluster_name" {}
variable "master_password" {
  description = "RDS password for the user specified"
}

variable "backup_retention_period" {
  default = 7
}
variable "instance_class" {
  default = "db.r4.large"
}

variable "rds_instance_count" {
  description = "Number of RDS cluster instances needed for hulk"
  type = number
  default = 2
}