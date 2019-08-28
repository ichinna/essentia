
variable "aws_region" {
  description = "AWS region"
  type        = "string"
  default     = "us-west-2"
}

variable "cluster_name" {
  description = "Cluster name"
  type        = "string"
}

variable "environment" {
  description = "Environment name"
  type        = "string"
}

variable "eks_cluster_name" {
  description = "EKS cluster name"
  type        = "string"
}


provider "aws" {
  region = "${var.aws_region}"
}