/*
 * This saves the terraform state remotely in S3
*/


terraform {
  backend "s3" {
    bucket = "hulktfstates"
    key    = "hulk/state/terraform.tfstate"
    region = "us-east-1"
  }
}
