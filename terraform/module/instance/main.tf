//TODO: variable
data "aws_ami" "ubuntu_ami" {
  most_recent      = true
  owners           = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "this" {
  ami           = coalesce(var.instance_ami ,data.aws_ami.ubuntu_ami.id)
  instance_type = var.instance_type
  key_name = var.key_name
  vpc_security_group_ids = var.vpc_security_group_ids
  subnet_id = var.subnet_id
  user_data = var.user_data
  iam_instance_profile = var.iam_instance_profile
  tags = {
    Name = "${var.app_name}-${var.environment}-${var.instance_name}"
  }

  root_block_device {
    volume_size = var.volume_size
  }
}