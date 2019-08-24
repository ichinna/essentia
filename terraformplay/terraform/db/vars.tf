variable "name" {}
variable "environment" {}
variable "region" {
  default = "us-west-2"
}
variable "master_password" {}


variable "cluster_name" {}

variable "backup_retention_period" {
  default = 7
}
variable "instance_class" {
  default = "db.r4.large"
}