
resource "aws_efs_file_system" "hulk" {
  creation_token = "${var.cluster_name}-hulk"
  encrypted      = true

  tags = {
    "Name"                      = "${var.cluster_name}-hulk"
    "cloudelements/environment" = "${var.environment}"
    "cloudelements/repo"        = "github.com/cloud-elements/hulk"
    "cloudelements/role"        = "storage"
    "cloudelements/app"         = "hulk"
    "terraform.io"              = "managed"
  }
}

resource "aws_efs_mount_target" "hulk" {
  count           = "${length(distinct(data.aws_subnet_ids.data.ids))}"
  file_system_id  = "${aws_efs_file_system.hulk.id}"
  subnet_id       = "${element(distinct(data.aws_subnet_ids.data.ids), count.index)}"
  security_groups = ["${aws_security_group.hulk_efs_sg.id}"]
}

/* desciption = "EFS outputs"
 * type       = "map"
 */
output "efs" {
  value = {
    hulk = {
      id        = "${aws_efs_file_system.hulk.id}"
      dns       = "${aws_efs_file_system.hulk.dns_name}"
      mount_ids = "${aws_efs_mount_target.hulk[*].id}"
      mount_dns = "${aws_efs_mount_target.hulk[*].dns_name}"
    }
  }
}
