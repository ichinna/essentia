

variable "sg_inbound_cidrs" {
  description = "List of CIDR blocks for ingress"
  type        = "list"
  default     = []
}

variable "sg_inbound_sg_ids" {
  description = "List of security group IDs for ingress"
  type        = "list"
  default     = []
}

resource "aws_security_group" "rds" {
  name        = "${var.cluster_name}-hulk-rds"
  description = "Hulk RDS access. Managed by Terraform."
  vpc_id      = "${data.aws_vpc.network.id}"

  tags = {
    "Name"                      = "${var.cluster_name}-hulk-rds"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/role"        = "hulk"
    "cloudelements/cluster"     = "${var.cluster_name}"
  }
}

resource "aws_security_group_rule" "rds_cidr_ingress_rule" {
  security_group_id = "${aws_security_group.rds.id}"
  type              = "ingress"
  from_port         = "8084"
  to_port           = "8084"
  protocol          = "-1"
  cidr_blocks       = "${data.aws_subnet.rds.*.cidr_block}"
}

/* description = "EFS security group ID."
 * type        = "string"
 */
output "sg_id" {
  value = "${aws_security_group.rds.id}"
}
