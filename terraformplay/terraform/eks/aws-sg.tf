

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

resource "aws_security_group" "hulk_eks_sg" {
  name        = "${var.cluster_name}-hulk-eks"
  description = "Hulk EKS access. Managed by Terraform."
  vpc_id      = "${data.aws_vpc.network.id}"

  tags = {
    "Name"                      = "${var.cluster_name}-hulk-eks"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/repo"        = "github.com/cloud-elements/hulk"
    "cloudelements/role"        = "firewall"
    "cloudelements/app"         = "hulk"
    "terraform.io"              = "managed"
  }
}

resource "aws_security_group_rule" "eks_cidr_ingress_basic" {
  security_group_id = "${aws_security_group.hulk_eks_sg.id}"
  type              = "ingress"
  from_port         = "0"
  to_port           = "65535"
  protocol          = "-1"
  cidr_blocks       = "${data.aws_subnet.data.*.cidr_block}"
}

resource "aws_security_group_rule" "eks_cidr_ingress_basic_all" {
  security_group_id = "${aws_security_group.hulk_eks_sg.id}"
  type              = "ingress"
  from_port         = "0"
  to_port           = "65535"
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

/* description = "eks security group ID."
 * type        = "string"
 */
output "sg_id" {
  value = "${aws_security_group.hulk_eks_sg.id}"
}
