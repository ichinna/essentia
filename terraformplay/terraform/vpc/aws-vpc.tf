resource "aws_vpc" "hulk_vpc" {
  cidr_block = "10.0.0.0/26"

  tags = {
    "Name" = "snp0-aws-usw2"
  }
}


resource "aws_subnet" "sn_a" {
  vpc_id            = "${aws_vpc.hulk_vpc.id}"
  cidr_block        = "10.0.0.0/28"
  availability_zone = "us-west-2a"

  tags = {
    "cloudelements/type" = "data"
  }
}


resource "aws_subnet" "sn_b" {
  vpc_id            = "${aws_vpc.hulk_vpc.id}"
  cidr_block        = "10.0.0.16/28"
  availability_zone = "us-west-2b"

  tags = {
    "cloudelements/type" = "data"
  }
}

resource "aws_subnet" "sn_c" {
  vpc_id            = "${aws_vpc.hulk_vpc.id}"
  cidr_block        = "10.0.0.32/28"
  availability_zone = "us-west-2a"

  tags = {
    "cloudelements/type" = "private"
  }
}


resource "aws_subnet" "sn_d" {
  vpc_id            = "${aws_vpc.hulk_vpc.id}"
  cidr_block        = "10.0.0.48/28"
  availability_zone = "us-west-2b"

  tags = {
    "cloudelements/type" = "private"
  }
}


output "network" {
  value = {
    hulk_vpc = {
      "vpc_id" : "${aws_vpc.hulk_vpc.id}"
      "data_subnet" : [
        "${aws_subnet.sn_a.id}",
        "${aws_subnet.sn_b.id}"
      ]
      "private_subnet" : [
        "${aws_subnet.sn_c.id}",
        "${aws_subnet.sn_d.id}"
      ]
    }
  }

}