provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

locals {
    user_data = <<-EOT
      #!/bin/bash
      echo "Hello Terraform!"
    EOT
}

module "vpc" {
  source = "../module/vpc"

  region = var.region
  environment = var.environment
  app_name = var.app_name

  vpc_cidr = var.vpc_cidr
  public_subnet_az1_cidr = var.public_subnet_az1_cidr
  public_subnet_az2_cidr = var.public_subnet_az2_cidr
  private_subnet_az1_cidr = var.private_subnet_az1_cidr
  private_subnet_az2_cidr = var.private_subnet_az2_cidr
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }
}

module "nat_gateway" {
  source = "../module/nat-gateway"

  environment = var.environment
  app_name = var.app_name
  vpc_id = module.vpc.vpc_id
  public_subnet_az1_id = module.vpc.public_subnet_az1_id
  public_subnet_az2_id = module.vpc.public_subnet_az2_id
  private_subnet_az1_id = module.vpc.private_subnet_az1_id
  private_subnet_az2_id = module.vpc.private_subnet_az2_id
  internet_gateway = module.vpc.internet_gateway
}

resource "aws_key_pair" "key_pair" {
  key_name = "${var.app_name}-${var.environment}-key-pair"
  public_key = file("~/.ssh/xrw_ec2.pub")
}

resource "aws_security_group" "from_my_home" {
  name        = "${var.app_name}-${var.environment}-from-my-gome-sg"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description      = "from my home only"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    # Check you public ip. It may change over time
    cidr_blocks      = [var.my_public_ip]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

module "jenkins" {
  source = "../module/instance"
  instance_name = "jenkins"
  environment = var.environment
  app_name = var.app_name
  vpc_security_group_ids = [aws_security_group.from_my_home.id]
  subnet_id = module.vpc.public_subnet_az1_id
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