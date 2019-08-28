/*
 * Copyright 2019 Cloud Elements
 *
 * AWS IAM role for RDS enhanced monitoring 
*/

data "aws_caller_identity" "current" {}


data "aws_vpc" "network" {
  tags = {
    Name = "snp0-aws-usw2"
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = "${data.aws_vpc.network.id}"

  tags = {
    "cloudelements/type" = "private"
  }
}

# data "aws_ami" "eks-worker" {
#   filter {
#     name   = "ami-00b95829322267382"
#     values = ["eks-worker-*"]
#   }

#   most_recent = true
#   owners      = ["${data.aws_caller_identity.current.account_id}"]       # Amazon
#   tags        = {
#       "Name" = "aws-ami-hulk"
#   }
# }

data "aws_ami" "eks-worker" {
  filter {
    name   = "name"
    values = ["eks-worker-*"]
  }

  most_recent = true
  owners      = ["602401143452"]
  tags = {
    "Name" = "shit"
  }
}



data "aws_subnet" "private" {
  count = "${length(data.aws_subnet_ids.private.ids)}"
  id    = "${tolist(data.aws_subnet_ids.private.ids)[count.index]}"
}


output "private_subnet" {
  value = "${data.aws_subnet.private.*.id}"
}

output "ami" {
  value = "${data.aws_ami.eks-worker.id}"
}


output "caller_user" {
  value = "${data.aws_caller_identity.current.account_id}"
}

output "private_sn_ids" {
  value = "${data.aws_subnet_ids.private.ids}"
}
