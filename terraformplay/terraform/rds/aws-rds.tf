
resource "aws_rds_cluster_instance" "cluster_instances" {
  count                           = "${var.rds_instance_count}"
  apply_immediately               = false
  auto_minor_version_upgrade      = false
  identifier                      = "${aws_rds_cluster.postgresql.id}-hulk-${count.index}"
  cluster_identifier              = "${aws_rds_cluster.postgresql.id}"
  instance_class                  = "${var.instance_class}"
  monitoring_role_arn             = "${data.aws_iam_role.rds_role.arn}"
  engine                          = "aurora-postgresql"
  engine_version                  = "10.7"
  monitoring_interval             = "5"
  db_subnet_group_name          = "${aws_db_subnet_group.rds_sn_group.name}"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.aws_region}"
    "environment" = "${var.environment}"
    "role"        = "hulk"
  }
}

resource "aws_rds_cluster" "postgresql" {
  apply_immediately             = false
  cluster_identifier            = "${var.name}-${var.environment}"
  engine                        = "aurora-postgresql"
  engine_version                = "10.7"
  database_name                 = "hulk"
  deletion_protection           = true
  master_username               = "hulk"
  master_password               = "${var.master_password}"
  backup_retention_period       = "${var.backup_retention_period}"
  preferred_backup_window       = "07:00-09:00"
  preferred_maintenance_window  = "sun:09:00-sun:09:30"
  vpc_security_group_ids        = ["${data.aws_security_group.rds.id}"]
  db_subnet_group_name          = "${aws_db_subnet_group.rds_sn_group.name}"
  port                          = 5432
  storage_encrypted             = true
  final_snapshot_identifier     = "hulk-final-snapshot-${var.environment}"

  tags = {
    "Name"                      = "${var.name}.${var.environment}.${var.aws_region}"
    "environment" = "${var.environment}"
    "role"        = "hulk"
  }
}
