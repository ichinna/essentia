

resource "aws_eks_cluster" "eks" {
  name     = "${var.eks_cluster_name}"
  role_arn = "${data.aws_iam_role.rds_role.arn}"

  vpc_config {
    subnet_ids         = "${data.aws_subnet_ids.private.ids}"
    security_group_ids = ["${aws_security_group.hulk_eks_sg.id}"]

  }
}

output "endpoint" {
  value = "${aws_eks_cluster.eks.endpoint}"
}

output "kubeconfig-certificate-authority-data" {
  value = "${aws_eks_cluster.eks.certificate_authority.0.data}"
}