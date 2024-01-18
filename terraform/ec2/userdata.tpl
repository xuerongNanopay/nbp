#!/bin/bash
apt-get update -y
apt-get install apache2 -y
echo "Hello EC2 " > /var/www/html/index.html
systemctl start apache2