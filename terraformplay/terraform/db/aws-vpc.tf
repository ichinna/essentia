resource "aws_vpc" "network" {
  cidr_block       = "10.0.0.0/26"
  instance_tenancy = "dedicated"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}"
    "environment" = "${var.environment}"
    "role"        = "hulk"
    "cluster"     = "${var.cluster_name}"
  }
}

resource "aws_subnet" "hulk_sn_a" {
  cidr_block        = "10.0.0.0/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2a"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-sna"
    "environment" = "${var.environment}"
    "role"        = "hulk"
    "consumer"    = "kubernetes"
  }
}

resource "aws_subnet" "hulk_sn_b" {
  cidr_block        = "10.0.0.16/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2a"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snb"
    "environment" = "${var.environment}"
    "role"        = "hulk"
    "consumer"    = "kubernetes"
  }
}

resource "aws_subnet" "hulk_sn_c" {
  cidr_block        = "10.0.0.32/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2b"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snc"
    "environment" = "${var.environment}"
    "role"        = "hulk"
    "consumer"    = "rds"
  }
}

resource "aws_subnet" "hulk_sn_d" {
  cidr_block        = "10.0.0.48/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2b"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snd"
    "environment" = "${var.environment}"
    "role"        = "hulk"
    "consumer"    = "rds"
  }
}

resource "aws_db_subnet_group" "hulk_sn_group" {
  name        = "hulk_sn_group"
  subnet_ids  = ["${aws_subnet.hulk_sn_a.id}", "${aws_subnet.hulk_sn_b.id}", "${aws_subnet.hulk_sn_c.id}", "${aws_subnet.hulk_sn_d.id}"]
  description = "Hulk subnet groups, Will be used by RDS instance and probably EKS"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-sng"
    "environment" = "${var.environment}"
    "role"        = "hulk"
  }
}