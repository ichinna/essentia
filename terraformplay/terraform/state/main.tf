resource "aws_s3_bucket" "b" {
  bucket = "hulktf"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    "Name"                      = "hulk"
    "environment" = "${var.env}"
    "role"        = "hulk-storage"
  }
}