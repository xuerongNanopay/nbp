output "region" {
  value = var.region
}

output "app_name" {
  value = var.app_name
}

output "environment" {
  value = var.environment
}

output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "internet_gateway" {
  value = aws_internet_gateway.internet_gateway
}

output "public_subnet_az1_id" {
  value = aws_subnet.public_subnet_za1.id
}
output "public_subnet_az2_id" {
  value = aws_subnet.public_subnet_za2.id
}

output "private_subnet_az1_id" {
  value = aws_subnet.private_subnet_za1.id
}
output "private_subnet_az2_id" {
  value = aws_subnet.private_subnet_za2.id
}

output "availability_zone_1" {
  value = data.aws_availability_zones.available_zones.names[0]
}
output "availability_zone_2" {
  value = data.aws_availability_zones.available_zones.names[1]
}