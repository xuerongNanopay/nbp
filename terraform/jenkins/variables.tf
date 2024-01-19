variable "region" {}
variable "environment"{}
variable "app_name" {}

variable "vpc_id"{}
variable "subnet_id"{}
variable "bucket_arn"{}
variable "bucket_name"{}

variable "domain_name" {
  default = "xrw.io"
  description = "domain name"
  type = string
}

variable "my_public_ip" {}