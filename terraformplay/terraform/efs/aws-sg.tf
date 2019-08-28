
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

resource "aws_security_group" "hulk_efs_sg" {
  name        = "${var.cluster_name}-hulk-efs"
  description = "Hulk EFS access. Managed by Terraform."
  vpc_id      = "${data.aws_vpc.network.id}"

  tags = {
    "Name"                      = "${var.cluster_name}-hulk-efs"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/repo"        = "github.com/cloud-elements/hulk"
    "cloudelements/role"        = "firewall"
    "cloudelements/app"         = "hulk"
    "terraform.io"              = "managed"
  }
}

resource "aws_security_group_rule" "efs_cidr_ingress_tcp_2029" {
  security_group_id = "${aws_security_group.hulk_efs_sg.id}"
  type              = "ingress"
  from_port         = "8084"
  to_port           = "8084"
  protocol          = "-1"
  cidr_blocks       = "${data.aws_subnet.private.*.cidr_block}"
}

resource "aws_security_group_rule" "efs_custom_cidr_ingress_tcp_2029" {
  count             = "${length(var.sg_inbound_cidrs) > 0 ? 1 : 0}"
  security_group_id = "${aws_security_group.hulk_efs_sg.id}"
  type              = "ingress"
  from_port         = "8084"
  to_port           = "8084"
  protocol          = "-1"
  cidr_blocks       = "${var.sg_inbound_cidrs}"
}

resource "aws_security_group_rule" "efs_custom_sg_ingress_tcp_2029" {
  count                    = "${length(var.sg_inbound_sg_ids)}"
  security_group_id        = "${aws_security_group.hulk_efs_sg.id}"
  type                     = "ingress"
  from_port                = "8084"
  to_port                  = "8084"
  protocol                 = "-1"
  source_security_group_id = "${element(var.sg_inbound_sg_ids, count.index)}"
}

/* description = "EFS security group ID."
 * type        = "string"
 */
output "sg_id" {
  value = "${aws_security_group.hulk_efs_sg.id}"
}
