
data "aws_vpc" "network" {
  tags = {
    Name = "${var.cluster_name}"
  }
}

data "aws_subnet_ids" "rds" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "cloudelements/consumer" = "rds"
  }
}

data "aws_subnet" "rds" {
  count = "${length(data.aws_subnet_ids.rds.ids)}"
  id    = "${tolist(data.aws_subnet_ids.rds.ids)[count.index]}"
}
