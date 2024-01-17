# resource "random_pet" "APP_NAME" {
#   length = 1
# }

variable "environment"{}
variable "app_name" {}
variable "vpc_id" {}
variable "public_subnet_az1_id" {}
variable "public_subnet_az2_id" {}
variable "private_subnet_az1_id" {}
variable "private_subnet_az2_id" {}
variable "internet_gateway" {}