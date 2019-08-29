

data "aws_vpc" "network" {
  tags = {
    Name = "${var.cluster_name}"
  }
}

data "aws_subnet_ids" "data" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "type" = "data"
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "type" = "private"
  }
}

data "aws_subnet" "private" {
  count = "${length(data.aws_subnet_ids.private.ids)}"
  id    = "${tolist(data.aws_subnet_ids.private.ids)[count.index]}"
}
