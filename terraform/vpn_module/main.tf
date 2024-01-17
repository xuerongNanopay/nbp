//VPC
//Subnets, 2x(public, private) = 4
//Internet gateway
//Route table
//Route For IG
//NAT GW

data "aws_availability_zones" "available_zones" {}

resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "${var.app_name}-${var.environment}-VPC"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.app_name}-${var.environment}-igw"
  }
}

resource "aws_route_table" "public_route_table_01" {
  vpc_id = aws_vpc.xrw_ue1_vpc.id

  tags = {
    Name = "${var.app_name}-${var.environment}-public-route-table"
  }
}

resource "aws_subnet" "public_subnet_za1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = var.public_subnet_az1_cidr
  availability_zone = data.aws_availability_zones.available_zones.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-${var.environment}-public-az1"
  }
}

resource "aws_subnet" "public_subnet_za2" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = var.public_subnet_az2_cidr
  availability_zone = data.aws_availability_zones.available_zones.names[1]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.app_name}-${var.environment}-public-az2"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id     = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

    tags = {
    Name = "${var.app_name}-${var.environment}-public-rt"
  }
}

resource "aws_route_table_association" "public_subnet_1_rt_association" {
  subnet_id      = aws_subnet.public_subnet_za1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_rt_association" {
  subnet_id      = aws_subnet.public_subnet_za2.id
  route_table_id = aws_route_table.public_route_table.id
}


resource "aws_subnet" "private_subnet_za1" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = var.private_subnet_az1_cidr
  availability_zone = data.aws_availability_zones.available_zones.names[0]
  map_public_ip_on_launch = false
  
  tags = {
    Name = "${var.app_name}-${var.environment}-private-az1"
  }
}

resource "aws_subnet" "private_subnet_za2" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = var.private_subnet_az2_cidr
  availability_zone = data.aws_availability_zones.available_zones.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.app_name}-${var.environment}-private-az2"
  }
}

resource "aws_route_table_association" "private_subnet_1_rt_association" {
  subnet_id      = aws_subnet.private_subnet_za1.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_rt_association" {
  subnet_id      = aws_subnet.private_subnet_za2.id
  route_table_id = aws_route_table.private_route_table.id
}