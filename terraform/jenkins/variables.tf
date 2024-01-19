variable "environment"{}
variable "app_name" {}

variable "subnet_id" {}

variable "instance_type" {
  default = "t2.large"
  description = "aws instance type to lunch jenkins"
  type = string
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs to associate with"
  type        = list(string)
  default     = null
}