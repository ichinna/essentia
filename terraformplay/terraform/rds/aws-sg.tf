
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
    "environment" = "${var.environment}"
    
    "role"        = "firewall"
    "app"         = "hulk"
    "terraform.io"              = "managed"
  }
}

resource "aws_security_group_rule" "rds_cidr_ingress" {
  security_group_id = "${aws_security_group.rds.id}"
  type              = "ingress"
  from_port         = "8084"
  to_port           = "8084"
  protocol          = "-1"
  cidr_blocks       = "${data.aws_subnet.private.*.cidr_block}"
}

resource "aws_security_group_rule" "rds_custom_cidr_ingress" {
  count             = "${length(var.sg_inbound_cidrs) > 0 ? 1 : 0}"
  security_group_id = "${aws_security_group.rds.id}"
  type              = "ingress"
  from_port         = "8084"
  to_port           = "8084"
  protocol          = "-1"
  cidr_blocks       = "${var.sg_inbound_cidrs}"
}

resource "aws_security_group_rule" "rds_custom_sg_ingress" {
  count                    = "${length(var.sg_inbound_sg_ids)}"
  security_group_id        = "${aws_security_group.rds.id}"
  type                     = "ingress"
  from_port                = "8084"
  to_port                  = "8084"
  protocol                 = "-1"
  source_security_group_id = "${element(var.sg_inbound_sg_ids, count.index)}"
}

/* description = "RDS security group ID."
 * type        = "string"
 */

data "aws_security_group" "rds" {
  id = "${aws_security_group.rds.id}"
}
