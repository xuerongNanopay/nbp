output "instance_ip" {
  value = module.jenkins.public_ip
}

output "instance_dns" {
  value = module.jenkins.public_dns
}