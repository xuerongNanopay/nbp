provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

locals {
    user_data = <<-EOT
      #!/bin/bash
      sudo apt-get update -y
      cd /tmp/
      wget https://s3.amazonaws.com/mountpoint-s3-release/latest/x86_64/mount-s3.deb
      sudo apt-get install ./mount-s3.deb -y

      sudo mkdir /jenkins_mount
      sudo mount-s3 ${var.bucket_name} /jenkins_mount
    EOT
}

resource "aws_key_pair" "key_pair" {
  key_name = "${var.app_name}-${var.environment}-key-pair"
  public_key = file("~/.ssh/xrw_ec2.pub")
}

data "aws_vpc" "selected" {
  id = var.vpc_id
}

data "aws_subnet" "selected" {
  id = var.subnet_id
}

resource "aws_security_group" "jenkins_sg" {
  name        = "${var.app_name}-${var.environment}-jenkins-sg"
  vpc_id      = data.aws_vpc.selected.id

  ingress {
    description      = "ssh my home only"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = [var.my_public_ip]
  }
  ingress {
    description      = "for mountpoint-s3 wget"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    # This IP may change over time
    cidr_blocks      = ["54.231.198.232/32", "16.182.73.96/32", "16.182.103.200/32"]
  }
  ingress {
    description      = "for mountpoint-s3 wget"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    # This IP may change over time
    cidr_blocks      = ["54.231.198.232/32", "16.182.73.96/32", "16.182.103.200/32"]
  }
  # ingress {
  #   description      = "from my home only"
  #   from_port        = 0
  #   to_port          = 0
  #   protocol         = "-1"
  #   # Check you public ip. It may change over time
  #   # cidr_blocks      = [var.my_public_ip]
  #   cidr_blocks      = ["0.0.0.0/0"]
  # }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect = "Allow"
    principals {
      identifiers = ["ec2.amazonaws.com"]
      type        = "Service"
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "s3_access" {
  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      var.bucket_arn,
      "${var.bucket_arn}/*"
    ]
  }
}

data "aws_iam_policy" "AmazonSSMManagedInstanceCore" {
  name = "AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "jenkins_instance_profile" {
  name = "${var.app_name}-${var.environment}-ec2-role"
  role = aws_iam_role.ec2_assume_role.name
}
resource "aws_iam_policy" "s3_access" {
  name   = "${var.app_name}-${var.environment}-s3-access"
  policy = data.aws_iam_policy_document.s3_access.json
}

resource "aws_iam_role" "ec2_assume_role" {
  name = "${var.environment}_ec2_assume_role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

resource "aws_iam_role_policy_attachment" "AmazonSSMManagedInstanceCore" {
  policy_arn = data.aws_iam_policy.AmazonSSMManagedInstanceCore.arn
  role       = aws_iam_role.ec2_assume_role.name
}

resource "aws_iam_role_policy_attachment" "s3_access" {
  policy_arn = aws_iam_policy.s3_access.arn
  role       = aws_iam_role.ec2_assume_role.name
}

module "jenkins" {
  source = "../module/instance"
  instance_type = "t2.small"
  instance_name = "jenkins"
  environment = var.environment
  app_name = var.app_name
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]
  iam_instance_profile = aws_iam_instance_profile.jenkins_instance_profile.name
  subnet_id = data.aws_subnet.selected.id
  user_data = local.user_data
  key_name = aws_key_pair.key_pair.id
}

data "aws_route53_zone" "hosted_zone" {
  name = var.domain_name
}

resource "aws_route53_record" "demain" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "jenkins"
  type    = "A"
  ttl     = "300"


  records = [module.jenkins.public_ip]

  depends_on = [ module.jenkins ]
}