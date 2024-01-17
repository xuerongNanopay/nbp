//VPC
//Subnets, 2x(public, private) = 4
//Internet gateway
//Route table
//Route For IG
//NAT GW

resource "aws_vpc" "vpc" {
  cidr_block = "192.168.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "${var.APP_NAME}-VPC"
  }
}