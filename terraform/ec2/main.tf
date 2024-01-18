provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
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
    cidr_blocks      = ["67.71.20.89/32"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

data "aws_ami" "ubuntu_ami" {
  most_recent      = true
  owners           = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "instance" {
  ami           = data.aws_ami.ubuntu_ami.id
  instance_type = "t2.micro"
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

data "aws_route53_zone" "hosted_zone" {
  name = var.domain_name
}

resource "aws_route53_record" "demain" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "ec2"
  type    = "A"
  ttl     = "300"


  records = [aws_instance.instance.public_ip]

  depends_on = [ aws_instance.instance ]
}