/*
 * Copyright 2018 Cloud Elements
 *
 * Terraform data resources for Soba.
 */

data "aws_iam_role" "rds_role" {
  name = "RoleHulkEks"
}

data "aws_vpc" "network" {
  tags = {
    Name = "${var.cluster_name}"
  }
}

data "aws_subnet_ids" "data" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "cloudelements/type" = "data"
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "cloudelements/type" = "private"
  }
}

data "aws_subnet" "data" {
  count = "${length(data.aws_subnet_ids.data.ids)}"
  id    = "${tolist(data.aws_subnet_ids.data.ids)[count.index]}"
}

data "aws_subnet" "private" {
  count = "${length(data.aws_subnet_ids.private.ids)}"
  id    = "${tolist(data.aws_subnet_ids.private.ids)[count.index]}"
}