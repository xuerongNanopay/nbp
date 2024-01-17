resource "random_pet" "APP_NAME" {
  length = 1
}

variable "APP_NAME" {
  type = string
  default = "${random_pet.APP_NAME.id}"
}