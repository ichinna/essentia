resource "aws_vpc" "test_vpc" {
  cidr_block = "${var.cidr}"
}