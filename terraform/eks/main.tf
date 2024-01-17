provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

module "vpc" {
  source = "../module/vpc"

  region = var.region
  environment = var.environment
  app_name = var.app_name

  vpc_cidr = var.vpc_cidr
  public_subnet_az1_cidr = var.public_subnet_az1_cidr
  public_subnet_az2_cidr = var.public_subnet_az2_cidr
  private_subnet_az1_cidr = var.private_subnet_az1_cidr
  private_subnet_az2_cidr = var.private_subnet_az2_cidr
}