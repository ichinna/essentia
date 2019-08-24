resource "aws_vpc" "network" {
  cidr_block       = "10.0.0.0/26"
  instance_tenancy = "dedicated"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/cluster"     = "${var.cluster_name}"
  }
}

resource "aws_subnet" "hulk_sn_a" {
  cidr_block        = "10.0.0.0/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2a"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-sna"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/consumer"    = "kubernetes"
  }
}

resource "aws_subnet" "hulk_sn_b" {
  cidr_block        = "10.0.0.16/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2a"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snb"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/consumer"    = "kubernetes"
  }
}

resource "aws_subnet" "hulk_sn_c" {
  cidr_block        = "10.0.0.32/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2b"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snc"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/consumer"    = "rds"
  }
}

resource "aws_subnet" "hulk_sn_d" {
  cidr_block        = "10.0.0.48/28"
  vpc_id            = "${aws_vpc.network.id}"
  availability_zone = "us-west-2b"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-snd"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/consumer"    = "rds"
  }
}

resource "aws_db_subnet_group" "hulk_sn_group" {
  name        = "hulk_sn_group"
  subnet_ids  = ["${aws_subnet.hulk_sn_a.id}", "${aws_subnet.hulk_sn_b.id}", "${aws_subnet.hulk_sn_c.id}", "${aws_subnet.hulk_sn_d.id}"]
  description = "Hulk subnet groups, Will be used by RDS instance and probably EKS"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.region}-sng"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
  }
}