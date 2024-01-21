provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

locals {
    user_data = <<-EOT
      #!/bin/bash
      sudo apt-get update -y

      # Install docker.
      sudo apt-get git -y
      sudo apt-get install ca-certificates curl gnupg
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      sudo chmod a+r /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update -y
      sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
      sudo git clone https://github.com/xuerongNanopay/nbp.git /home/ubuntu/nbp
    EOT
}

# sudo docker compose -f /home/ubuntu/nbp/docker/nbp-local-compose/docker-compose.yaml up -d

resource "aws_key_pair" "key_pair" {
  key_name = "${var.app_name}-${var.environment}-key-pair"
  public_key = file("~/.ssh/xrw_ec2.pub")
}

data "aws_vpc" "selected" {
  id = var.vpc_id
}

data "aws_subnet" "selected" {
  id = var.subnet_id
}

resource "aws_security_group" "nbp_sg" {
  name        = "${var.app_name}-${var.environment}-nbp-sg"
  vpc_id      = data.aws_vpc.selected.id

  ingress {
    description      = "my home only"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = [var.my_public_ip]
  }

  ingress {
    description      = "export 3000"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

    ingress {
    description      = "export 3000"
    from_port        = 3040
    to_port          = 3040
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-nbp-sg"
  }
}

module "nbp" {
  source = "../module/instance"
  instance_type = "t2.small"
  instance_name = "nbp"
  environment = var.environment
  app_name = var.app_name
  vpc_security_group_ids = [aws_security_group.nbp_sg.id]
  subnet_id = data.aws_subnet.selected.id
  user_data = local.user_data
  key_name = aws_key_pair.key_pair.id
}

# resource "terraform_data" "push_jenkins_data" {
#   triggers_replace = module.nbp.instance_id
#   provisioner "local-exec" {
#     when = create
#     interpreter = ["/bin/bash", "-c"]
#     command = <<EOT
#       sleep 20 && \
#       scp -r -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ../../docker/data/mysql_dump/nbp.sql ubuntu@${module.nbp.public_ip}:~/nbp.sql && \
#       ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@${module.nbp.public_ip} 'sudo docker exec -i mysql_8 sh -c "exec mysql -u root -p123456 nbp < nbp.sql"'
#     EOT
#     on_failure = continue
#   }
# }

# resource "terraform_data" "pull_jenkins_data" {
#   triggers_replace = aws_route53_record.demain.id
#   provisioner "local-exec" {
#     when = destroy
#     interpreter = ["/bin/bash", "-c"]
#     command = <<EOT
#       ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io '[[ -f ~/jenkins_docker/jenkins-volumn.tgz ]] && (rm ~/jenkins_docker/jenkins-volumn.tgz) || echo "No jenkins-volumn.tgz"' && \
#       ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io 'cd ~/jenkins_docker && sudo tar czf jenkins-volumn.tgz ./volumn' && \
#       ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io 'cd ~/jenkins_docker && sudo docker compose down' && \
#       scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io:~/jenkins_docker/jenkins-volumn.tgz ./jenkins_docker
#     EOT
#     # on_failure = continue
#   }
# }

data "aws_route53_zone" "hosted_zone" {
  name = var.domain_name
}

resource "aws_route53_record" "demain" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "nbp"
  type    = "A"
  ttl     = "300"


  records = [module.nbp.public_ip]

  depends_on = [ module.nbp ]
}