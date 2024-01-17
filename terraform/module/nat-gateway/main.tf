resource "aws_eip" "eip_for_nat_gateway_az1" {
  domain = "vpc"

  tags = {
    Name = "${var.app_name}-${var.environment}-nat-gateway-ip-az1"
  }
}

resource "aws_eip" "eip_for_nat_gateway_az2" {
  domain = "vpc"

  tags = {
    Name = "${var.app_name}-${var.environment}-nat-gateway-ip-az2"
  }
}

resource "aws_nat_gateway" "nat_gateway_az1" {
  allocation_id = aws_eip.eip_for_nat_gateway_az1.id
  subnet_id = var.public_subnet_az1_id
  connectivity_type = "public"

  depends_on = [var.internet_gateway]

  tags = {
    Name = "${var.app_name}-${var.environment}-nat-gateway-az1"
  }
}

resource "aws_nat_gateway" "nat_gateway_az2" {
  allocation_id = aws_eip.eip_for_nat_gateway_az2.id
  subnet_id = var.public_subnet_az2_id
  connectivity_type = "public"

  depends_on = [var.internet_gateway]

  tags = {
    Name = "${var.app_name}-${var.environment}-nat-gateway-az2"
  }
}

resource "aws_route_table" "private_route_table_az1" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway_az1
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-private-rt-az1"
  }
}

resource "aws_route_table_association" "private_az1_ng_rt_association" {
  subnet_id      = var.private_subnet_az1_id
  route_table_id = aws_route_table.private_route_table_az1.id
}


resource "aws_route_table" "private_route_table_az2" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway_az2
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-private-rt-az2"
  }
}

resource "aws_route_table_association" "private_az2_ng_rt_association" {
  subnet_id      = var.private_subnet_az2_id
  route_table_id = aws_route_table.private_route_table_az2.id
}