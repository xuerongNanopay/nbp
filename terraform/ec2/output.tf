output "instance_ip" {
  value = aws_instance.instance.public_ip
}

output "instance_dns" {
  value = aws_instance.instance.public_dns
}