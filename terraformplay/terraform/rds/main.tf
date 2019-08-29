provider "aws" {
    shared_credentials_file = "~/.aws/credentials"
    profile                 = "default"
    region                  = "${var.aws_region}"
}