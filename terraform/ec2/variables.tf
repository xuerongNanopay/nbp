variable "region" {}
variable "environment"{}
variable "app_name" {}

variable "vpc_cidr"{}
variable "public_subnet_az1_cidr" {}
variable "public_subnet_az2_cidr" {}
variable "private_subnet_az1_cidr" {}
variable "private_subnet_az2_cidr" {}

variable "domain_name" {
  default = "xrw.io"
  description = "domain name"
  type = string
}