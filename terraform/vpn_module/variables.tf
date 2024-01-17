resource "random_pet" "APP_NAME" {
  length = 1
}

variable "region" {}
variable "environment"{}
variable "app_name" {}

variable "vpc_cidr"{}
variable "public_subnet_az1_cidr" {}
variable "public_subnet_az2_cidr" {}