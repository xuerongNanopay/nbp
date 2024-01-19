provider "aws" {
  region = var.region
  shared_credentials_files = ["~/.aws/credentials"]
}

locals {
    user_data = <<-EOT
      #!/bin/bash
      sudo apt-get update -y

      # Install docker.
      sudo apt-get update
      sudo apt-get install ca-certificates curl gnupg
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      sudo chmod a+r /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update -y
      sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
    EOT
}

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

resource "aws_security_group" "jenkins_sg" {
  name        = "${var.app_name}-${var.environment}-jenkins-sg"
  vpc_id      = data.aws_vpc.selected.id

  ingress {
    description      = "my home only"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = [var.my_public_ip]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.environment}-jenkins-sg"
  }
}

module "jenkins" {
  source = "../module/instance"
  instance_type = "t2.small"
  instance_name = "jenkins"
  environment = var.environment
  app_name = var.app_name
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]
  subnet_id = data.aws_subnet.selected.id
  user_data = local.user_data
  key_name = aws_key_pair.key_pair.id
}

resource "terraform_data" "push_jenkins_data" {
  triggers_replace = module.jenkins.instance_id
  provisioner "local-exec" {
    when = create
    interpreter = ["/bin/bash", "-c"]
    command = <<EOT
      sleep 20 && \
      scp -r -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ./jenkins_docker ubuntu@${module.jenkins.public_ip}:~/jenkins_docker && \
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@${module.jenkins.public_ip} '[[ -f ~/jenkins_docker/jenkins-volumn.tgz ]] && (cd ~/jenkins_docker && tar xzf jenkins-volumn.tgz) || echo "No jenkins-volumn.tgz"'
    EOT
  }
}

resource "terraform_data" "pull_jenkins_data" {
  triggers_replace = aws_route53_record.demain.id
  provisioner "local-exec" {
    when = destroy
    interpreter = ["/bin/bash", "-c"]
    command = <<EOT
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io '[[ -f ~/jenkins_docker/jenkins-volumn.tgz ]] && (rm ~/jenkins_docker/jenkins-volumn.tgz) || echo "No jenkins-volumn.tgz"' && \
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io 'cd ~/jenkins_docker && sudo tar czf jenkins-volumn.tgz ./volumn' && \
      ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io 'cd ~/jenkins_docker && sudo docker compose down' && \
      scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/xrw_ec2 ubuntu@jenkins.xrw.io:~/jenkins_docker/jenkins-volumn.tgz ./jenkins_docker
    EOT
    # on_failure = continue
  }
}

data "aws_route53_zone" "hosted_zone" {
  name = var.domain_name
}

resource "aws_route53_record" "demain" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "jenkins"
  type    = "A"
  ttl     = "300"


  records = [module.jenkins.public_ip]

  depends_on = [ module.jenkins ]
}