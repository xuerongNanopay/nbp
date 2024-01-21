output "instance_ip" {
  value = module.nbp.public_ip
}

output "instance_dns" {
  value = module.nbp.public_dns
}