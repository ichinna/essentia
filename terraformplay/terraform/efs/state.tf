

terraform {
  backend "s3" {
    bucket = "hulktf"
    key    = "hulk/efs/terraform.tfstate"
    region = "us-west-2"
  }
}
