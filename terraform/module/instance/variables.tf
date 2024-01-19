variable "environment"{}
variable "app_name" {}

variable "subnet_id" {}
variable "instance_name" {}

variable "volume_size" {
  default = 10
  type = number
}

variable "instance_type" {
  default = "t2.micro"
  description = "aws instance type to lunch jenkins"
  type = string
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs to associate with"
  type        = list(string)
  default     = null
}

variable "user_data" {
  description = "The user data to provide when launching the instance"
  type        = string
  default     = null
}

variable "key_name" {
  description = "Key name of the Key Pair to use for the instance; which can be managed using the `aws_key_pair` resource"
  type        = string
  default     = null
}