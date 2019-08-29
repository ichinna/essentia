/*
 * This saves the terraform state remotely in S3
*/


terraform {
    backend "s3" {
        bucket      =   "hulktf"
        key         =   "hulk/rds/terraform.tfstate"
        region      =   "us-west-2"
    }
}