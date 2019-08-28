/*
 * Copyright 2018 Cloud Elements
 *
 * Terraform remote state configuration.
 */

terraform {
  backend "s3" {
    bucket = "hulktf"
    key    = "hulk/efs/terraform.tfstate"
    region = "us-west-2"
  }
}
