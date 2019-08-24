resource "aws_s3_bucket" "b" {
  bucket = "hulktfstates"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    "Name"                      = "hulk"
    "cloudelements/environment" = "${var.env}"
    "cloudelements/role"        = "hulk-storage"
  }
}