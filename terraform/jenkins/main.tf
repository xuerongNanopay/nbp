resource "aws_instance" "instance" {
  ami           = data.aws_ami.ubuntu_ami.id
  instance_type = "t2.large"
  key_name = aws_key_pair.key_pair.id
  vpc_security_group_ids = [aws_security_group.from_my_home.id]
  subnet_id = module.vpc.public_subnet_az1_id
  user_data = file("userdata.tpl")

  tags = {
    Name = "${var.app_name}-${var.environment}-ec2"
  }

  root_block_device {
    volume_size = 10
  }
}